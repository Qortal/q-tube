import * as React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
//import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useDispatch } from 'react-redux'
import { setNotification } from '../../../state/features/notificationsSlice'
import { Box, ButtonBase } from '@mui/material'

export default function ContextMenuResource({
  children,
  name,
  service,
  identifier,
  link
}: any) {
  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number
    mouseY: number
  } | null>(null)
  const dispatch = useDispatch()
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    )
  }

  const handleClose = () => {
    setContextMenu(null)
  }

  return (
    <div
      onContextMenu={handleContextMenu}
      style={{ cursor: 'context-menu', width: '100%' }}
    >
      {children}
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem>
          <ButtonBase
            onClick={() => {
                handleClose()
                navigator.clipboard.writeText(`${link}`).then(() => {
                    dispatch(
                        setNotification({
                            msg: 'Copied to clipboard!',
                            alertType: 'success'
                        })
                    )
                })
            }}
          >
            <Box
              sx={{
                fontSize: '16px'
              }}
            >
              Copy Link
            </Box>
          </ButtonBase>
        </MenuItem>
      </Menu>
    </div>
  )
}
