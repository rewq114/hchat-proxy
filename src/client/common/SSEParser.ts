// src/core/common/communication/SSEParser.ts

/**
 * Server-Sent Events (SSE) 파서
 * 모든 모듈에서 공통으로 사용할 수 있는 SSE 파싱 유틸리티
 */
export interface SSEEvent {
  event?: string;
  data: string;
  id?: string;
  retry?: number;
}

export class SSEParser {
  private buffer = "";
  private decoder = new TextDecoder();

  async *parse(response: Response): AsyncIterableIterator<SSEEvent> {
    if (!response.body) {
      throw new Error("Response body is empty");
    }

    // ReadableStream을 지원하는 환경에서 스트리밍 파싱
    if (typeof response.body.getReader === "function") {
      const reader = response.body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          this.buffer += this.decoder.decode(value, { stream: true });
          yield* this.extractEvents();
        }

        // 마지막 남은 버퍼 처리
        if (this.buffer.trim()) {
          yield* this.extractEvents(true);
        }
      } finally {
        reader.releaseLock();
      }
    } else {
      // Node.js 환경에서 async iterable 지원 확인
      if (Symbol.asyncIterator in response.body) {
        for await (const chunk of response.body as AsyncIterable<Uint8Array>) {
          this.buffer += this.decoder.decode(chunk, { stream: true });
          yield* this.extractEvents();
        }

        if (this.buffer.trim()) {
          yield* this.extractEvents(true);
        }
      } else {
        // 최후의 수단: 전체 텍스트 읽기
        const text = await response.text();
        this.buffer = text;
        yield* this.extractEvents(true);
      }
    }
  }

  private *extractEvents(flush = false): Generator<SSEEvent> {
    const eventBlocks = this.buffer.split("\n\n");

    if (!flush) {
      this.buffer = eventBlocks.pop() || "";
    } else {
      this.buffer = "";
    }

    for (const eventBlock of eventBlocks) {
      if (!eventBlock.trim()) continue;

      const event: Partial<SSEEvent> = {};
      const dataLines: string[] = [];
      const lines = eventBlock.split("\n");

      for (const line of lines) {
        // 주석 라인 무시
        if (line.trim().startsWith(":")) continue;

        const separatorIndex = line.indexOf(":");

        let field: string;
        let value: string;

        if (separatorIndex === -1) {
          // 콜론이 없는 경우 전체를 필드명으로 사용
          field = line.trim();
          value = "";
        } else {
          field = line.slice(0, separatorIndex).trim();
          value = line.slice(separatorIndex + 1).replace(/\r$/, "");
          // SSE 스펙: 콜론 뒤 첫 번째 공백만 제거
          if (value.startsWith(" ")) {
            value = value.slice(1);
          }
        }

        switch (field) {
          case "event":
            event.event = value;
            break;
          case "data":
            dataLines.push(value);
            break;
          case "id":
            event.id = value;
            break;
          case "retry": {
            const retryValue = parseInt(value, 10);
            if (!isNaN(retryValue) && retryValue >= 0) {
              event.retry = retryValue;
            }
            break;
          }
        }
      }

      if (dataLines.length > 0) {
        event.data = dataLines.join("\n");
        yield event as SSEEvent;
      }
    }
  }

  reset(): void {
    this.buffer = "";
  }
}
