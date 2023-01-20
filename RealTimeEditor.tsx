import React from 'react'
import clsx from 'clsx'

import { Avatar as AntAvatar } from 'antd'

import { Dropdown, Menu, MenuItem, Avatar } from '@pepper/ui-core'
import { EDITOR_LIST } from '@pepper/utils/lib/constant/enum/editor_list_test'

import styles from './_.module.css'

const currentEditorsList = (): React.ReactElement => (
  <Menu className={styles.dropdownEditorsList}>
    {EDITOR_LIST.map((item, idx) => {
      return (
        <MenuItem key={idx} className={styles.editorNameAvatarContainer}>
          <Avatar
            nameChar={`${item?.name[0]}`}
            showBorderColor={true}
            size={18}
            className={styles.editorDropdownAvatar}
            src={item?.avatar}
          >
            {`${item?.name[0]}`}
          </Avatar>
          <div className={styles.editorName}>{item?.name}</div>
        </MenuItem>
      )
    })}
  </Menu>
)

export const RealTimeEditors = (): JSX.Element => {
  let editorsAboveFour
  let editorAvatarsDisplayed: number

  if (EDITOR_LIST.length > 4) {
    editorsAboveFour = EDITOR_LIST.length - 4
    editorAvatarsDisplayed = 4
  } else {
    editorAvatarsDisplayed = EDITOR_LIST.length
  }

  const editorAvatarsDisplayArray = EDITOR_LIST.slice(0, editorAvatarsDisplayed)

  return (
    <Dropdown
      overlay={currentEditorsList}
      className={styles.currentEditorsListDropdown}
    >
      <div className={styles.peCollaboratorsWrap}>
        <AntAvatar.Group>
          {editorAvatarsDisplayArray.map((item, idx) => {
            return (
              <Avatar
                key={idx}
                showBorderColor={true}
                nameChar={`${item?.name[0]}`}
                size={32}
                src={item?.avatar}
                className={styles.editorAvatarView}
              >
                {item?.name[0]}
              </Avatar>
            )
          })}
        </AntAvatar.Group>
        <div
          className={clsx(styles.remainingEditors, {
            [styles.hideEditorNumber]:
              editorAvatarsDisplayed === EDITOR_LIST.length
          })}
        >
          +{editorsAboveFour}
        </div>
      </div>
    </Dropdown>
  )
}
