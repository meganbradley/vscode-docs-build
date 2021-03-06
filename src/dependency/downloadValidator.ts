import * as crypto from 'crypto';
import { EventStream } from "../common/eventStream";
import { DocsError } from "../error/docsError";
import { DownloadValidating } from "../common/loggingEvents";
import { ErrorCode } from "../error/errorCode";

export function validateDownload(eventStream: EventStream, buffer: Buffer, integrity: string) {
    eventStream.post(new DownloadValidating());
    if (integrity && integrity.length > 0) {
        let downloadFileIntegrity = getBufferIntegrityHash(buffer);
        if(downloadFileIntegrity !== integrity.toUpperCase()){
            throw new DocsError(`Integrity check failed.`, ErrorCode.CheckIntegrityFailed);
        }
    }
}

function getBufferIntegrityHash(buffer: Buffer): string {
    let hash = crypto.createHash('sha256');
    hash.update(buffer);
    let value = hash.digest('hex').toUpperCase();
    return value;
}