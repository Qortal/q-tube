import React, { useCallback } from 'react'
import { Box, Button, TextField, Typography, Modal } from '@mui/material'
import {
  useDropzone,
  DropzoneRootProps,
  DropzoneInputProps
} from 'react-dropzone'
import Compressor from 'compressorjs'

const toBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => {
      reject(error)
    }
  })

interface ImageUploaderProps {
  children: React.ReactNode
  onPick: (base64Img: string) => void
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ children, onPick }) => {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 1) {
        return
      }
      let compressedFile: File | undefined

      try {
        const image = acceptedFiles[0]
        await new Promise<void>((resolve) => {
          new Compressor(image, {
            quality: 0.6,
            maxWidth: 1200,
            mimeType: 'image/webp',
            success(result) {
              const file = new File([result], 'name', {
                type: 'image/webp'
              })
              compressedFile = file
              resolve()
            },
            error(err) {}
          })
        })
        if (!compressedFile) return
        const base64Img = await toBase64(compressedFile)

        onPick(base64Img as string)
      } catch (error) {
        console.error(error)
      }
    },
    [onPick]
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive
  }: {
    getRootProps: () => DropzoneRootProps
    getInputProps: () => DropzoneInputProps
    isDragActive: boolean
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  })

  return (
    <Box
      {...getRootProps()}
      sx={{
        display: 'flex'
      }}
    >
      <input {...getInputProps()} />
      {children}
    </Box>
  )
}

export default ImageUploader
