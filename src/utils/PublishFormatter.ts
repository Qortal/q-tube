export const publishFormatter = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
      const result = reader.result
      reader.onload = null // remove onload handler
      reader.onerror = null // remove onerror handler
      resolve(result)
    }

    reader.onerror = (error) => {
      reader.onload = null // remove onload handler
      reader.onerror = null // remove onerror handler
      reject(error)
    }
  })

export function objectToBase64(obj: any) {
  // Step 1: Convert the object to a JSON string
  const jsonString = JSON.stringify(obj)

  // Step 2: Create a Blob from the JSON string
  const blob = new Blob([jsonString], { type: 'application/json' })

  // Step 3: Create a FileReader to read the Blob as a base64-encoded string
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // Remove 'data:application/json;base64,' prefix
        const base64 = reader.result.replace(
          'data:application/json;base64,',
          ''
        )
        resolve(base64)
      } else {
        reject(new Error('Failed to read the Blob as a base64-encoded string'))
      }
    }
    reader.onerror = () => {
      reject(reader.error)
    }
    reader.readAsDataURL(blob)
  })
}

export function objectToFile(obj: any) {
  // Step 1: Convert the object to a JSON string
  const jsonString = JSON.stringify(obj)

  // Step 2: Create a Blob from the JSON string
  return new Blob([jsonString], { type: 'application/json' })
}

export function objectToUint8Array(obj: any) {
  // Convert the object to a JSON string
  const jsonString = JSON.stringify(obj)

  // Encode the JSON string as a byte array using TextEncoder
  const encoder = new TextEncoder()
  const byteArray = encoder.encode(jsonString)

  // Create a new Uint8Array and set its content to the encoded byte array
  const uint8Array = new Uint8Array(byteArray)

  return uint8Array
}

export function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  const length = uint8Array.length
  let binaryString = ''
  const chunkSize = 1024 * 1024 // Process 1MB at a time

  for (let i = 0; i < length; i += chunkSize) {
    const chunkEnd = Math.min(i + chunkSize, length)
    const chunk = uint8Array.subarray(i, chunkEnd)
    binaryString += Array.from(chunk, (byte) => String.fromCharCode(byte)).join(
      ''
    )
  }

  return btoa(binaryString)
}

export function objectToUint8ArrayFromResponse(obj: any) {
  const len = Object.keys(obj).length
  const result = new Uint8Array(len)

  for (let i = 0; i < len; i++) {
    result[i] = obj[i]
  }

  return result
}
// export function uint8ArrayToBase64(arrayBuffer: Uint8Array): string {
//   let binary = ''
//   const bytes = new Uint8Array(arrayBuffer)
//   const len = bytes.length

//   for (let i = 0; i < len; i++) {
//     binary += String.fromCharCode(bytes[i])
//   }

//   return btoa(binary)
// }

export function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  return bytes
}

export function uint8ArrayToObject(uint8Array: Uint8Array) {
  // Decode the byte array using TextDecoder
  const decoder = new TextDecoder()
  const jsonString = decoder.decode(uint8Array)

  // Convert the JSON string back into an object
  const obj = JSON.parse(jsonString)

  return obj
}

export function processFileInChunks(file: File): Promise<Uint8Array> {
  return new Promise(
    (resolve: (value: Uint8Array) => void, reject: (reason?: any) => void) => {
      const reader = new FileReader()

      reader.onload = function (event: ProgressEvent<FileReader>) {
        const arrayBuffer = event.target?.result as ArrayBuffer
        const uint8Array = new Uint8Array(arrayBuffer)
        resolve(uint8Array)
      }

      reader.onerror = function (error: ProgressEvent<FileReader>) {
        reject(error)
      }

      reader.readAsArrayBuffer(file)
    }
  )
}

// export async function processFileInChunks(file: File, chunkSize = 1024 * 1024): Promise<Uint8Array> {
//   const fileStream = file.stream();
//   const reader = fileStream.getReader();
//   const totalLength = file.size;

//   if (totalLength <= 0 || isNaN(totalLength)) {
//     throw new Error('Invalid file size');
//   }

//   const combinedArray = new Uint8Array(totalLength);
//   let offset = 0;

//   while (offset < totalLength) {
//     const { value, done } = await reader.read();

//     if (done) {
//       break;
//     }

//     const chunk = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);

//     // Set elements one by one instead of using combinedArray.set(chunk, offset)
//     for (let i = 0; i < chunk.length; i++) {
//       combinedArray[offset + i] = chunk[i];
//     }

//     offset += chunk.length;
//   }

//   return combinedArray;
// }
