import Component   from './Component'

import Button      from './base/Button'
import Form        from './base/Form'
import List        from './base/List'
import Tab         from './base/Tab'
import Panel       from './base/Panel'
import DropDown    from './base/DropDown'

import FAB         from './FAB'
import EmojiPicker from './EmojiPicker'
import chat        from './chat'

const ui       = { }

ui.Component   = Component

// standard components
ui.Button      = Button
ui.Form        = Form
ui.List        = List
ui.Tab         = Tab
ui.Panel       = Panel
ui.DropDown    = DropDown

// complex  components
ui.FAB         = FAB
ui.EmojiPicker = EmojiPicker
ui.chat        = chat

export default ui