import MDEditor, { commands, ICommand, TextState, TextAreaTextApi } from '@uiw/react-md-editor';
import h3 from './h3.svg';
import boldSvg from './bold.svg';
import listSvg from './list.svg';
import italicsSvg from './italics.svg';
import codeSvg from './code.svg';

const boldText: ICommand = {
    name: 'boldText',
    keyCommand: 'boldText',
    buttonProps: { 'aria-label': 'Bold text' },
    icon: (<img src={boldSvg} alt="sidebar icon" className="sidebar__icon" />),
    execute: (state: TextState, api: TextAreaTextApi) => {
      let modifyText = `**${state.selectedText}**\n`;
      if (!state.selectedText) {
        modifyText = `**bold text**`;
      }
      api.replaceSelection(modifyText);
    },
};

const listText: ICommand = {
  name: 'listText',
  keyCommand: 'listText',
  buttonProps: { 'aria-label': 'List text' },
  icon: (<img src={listSvg} alt="sidebar icon" className="sidebar__icon" />),
  execute: (state: TextState, api: TextAreaTextApi) => {
    let modifyText = `- ${state.selectedText}\n`;
    if (!state.selectedText) {
      modifyText = `- `;
    }
    api.replaceSelection(modifyText);
  },
};

const italicsText: ICommand = {
  name: 'italicsText',
  keyCommand: 'italicsText',
  buttonProps: { 'aria-label': 'Italics text' },
  icon: (<img src={italicsSvg} alt="sidebar icon" className="sidebar__icon" />),
  execute: (state: TextState, api: TextAreaTextApi) => {
    let modifyText = `*${state.selectedText}*`;
    if (!state.selectedText) {
      modifyText = `*Italics text*`;
    }
    api.replaceSelection(modifyText);
  },
};

const codeText: ICommand = {
  name: 'codeText',
  keyCommand: 'codeText',
  buttonProps: { 'aria-label': 'Italics text' },
  icon: (<img src={codeSvg} alt="sidebar icon" className="sidebar__icon" />),
  execute: (state: TextState, api: TextAreaTextApi) => {
    let modifyText = "`" + "`" + "`" + state.selectedText + "`" + "`" + "`";
    if (!state.selectedText) {
      modifyText = "`" + "`" + "`js" + "code" + "`" + "`" + "`";
    }
    api.replaceSelection(modifyText);
  },
};

export default function MarkDownForm(props: any) {
    const { body, setBody, setRequiredBody, requiredBody } = props;
    return <MDEditor
        value={body}
        onChange={(val) => {
            setBody(val!);
        }}
        placeholder="# Hello, *world*!"
        commands={[
          boldText,
          commands.divider,
          listText,
          commands.divider,
          italicsText,
          commands.divider,
          codeText,
          commands.divider,
          commands.group([commands.title4, commands.title5, commands.title6], {
              name: 'h',
              groupName: 'title',
              buttonProps: { 'aria-label': 'Insert title'},
              icon: (<img src={h3} alt="sidebar icon" className="sidebar__icon" />),
          }),
        ]}
        height={500}
        className={`${requiredBody}`}
        onMouseDown={() => {
          setRequiredBody('')
        }}
    />;
};
