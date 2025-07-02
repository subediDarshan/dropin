export async function generateAESKey() {
    return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
        "encrypt",
        "decrypt",
    ]);
}

export async function encryptFile(file: File, key: CryptoKey) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = await file.arrayBuffer();
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        data
    );
    return { encryptedBlob: new Blob([encrypted]), iv };
}

export async function decryptBlob(blob: Blob, key: CryptoKey, iv: Uint8Array) {
    const encryptedBuffer = await blob.arrayBuffer();
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        encryptedBuffer
    );
    return new Blob([decrypted]);
}

export function encodeBase64(buf: Uint8Array) {
    return btoa(String.fromCharCode(...buf));
}

export function decodeBase64(b64: string) {
    const bin = atob(b64);
    return new Uint8Array([...bin].map((c) => c.charCodeAt(0)));
}
