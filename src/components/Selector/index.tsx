import React, { useRef } from 'react'
import { LabelValueType, RawValueType } from '../Autocomplete/Autocomplete';
import SingleSelector from './Selector';

export interface RefSelectorProps {
  focus: () => void;
  blur: () => void;
}

export interface SelectorProps {
  id: string;
  prefixCls: string;
  showSearch?: boolean;
  open: boolean;
  /** Display in the Selector value, it's not same as `value` prop */
  values: LabelValueType[];
  multiple: boolean;
  searchValue: string;
  activeValue: string;
  inputElement: JSX.Element;

  autoFocus?: boolean;
  accessibilityIndex: number;
  tabIndex?: number;
  disabled?: boolean;
  placeholder?: React.ReactNode;
  removeIcon?: RenderNode;

  // Tags
  maxTagCount?: number;
  maxTagTextLength?: number;
  maxTagPlaceholder?: React.ReactNode | ((omittedValues: LabelValueType[]) => React.ReactNode);
  tagRender?: (props: CustomTagProps) => React.ReactElement;

  /** Check if `tokenSeparators` contains `\n` or `\r\n` */
  tokenWithEnter?: boolean;

  // Motion
  choiceTransitionName?: string;

  onToggleOpen: (open?: boolean) => void;
  /** `onSearch` returns go next step boolean to check if need do toggle open */
  onSearch: (searchText: string, fromTyping: boolean, isCompositing: boolean) => boolean;
  onSearchSubmit: (searchText: string) => void;
  onSelect: (value: RawValueType, option: { selected: boolean }) => void;
  onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;

  /**
   * @private get real dom for trigger align.
   * This may be removed after React provides replacement of `findDOMNode`
   */
  domRef: React.Ref<HTMLDivElement>;
}

const Selector: React.RefForwardingComponent<RefSelectorProps, SelectorProps> = (props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const compositionStatusRef = useRef<boolean>(false);

  const {
    prefixCls,
    multiple,
    open,
    showSearch,
    tokenWithEnter,

    onSearch,
    onSearchSubmit,
    onToggleOpen,
    onInputKeyDown,

    domRef,
  } = props;

  // ======================= Ref =======================
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    blur: () => {
      inputRef.current.blur();
    },
  }));

  // ====================== Input ======================
  const [getInputMouseDown, setInputMouseDown] = useLock(0);

  const onInternalInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    const { which } = event;

    if (which === KeyCode.UP || which === KeyCode.DOWN) {
      event.preventDefault();
    }

    if (onInputKeyDown) {
      onInputKeyDown(event);
    }

    if (which === KeyCode.ENTER && mode === 'tags' && !compositionStatusRef.current && !open) {
      // When menu isn't open, OptionList won't trigger a value change
      // So when enter is pressed, the tag's input value should be emitted here to let selector know
      onSearchSubmit((event.target as HTMLInputElement).value);
    }

    if (![KeyCode.SHIFT, KeyCode.TAB, KeyCode.BACKSPACE, KeyCode.ESC].includes(which)) {
      onToggleOpen(true);
    }
  };

  /**
   * We can not use `findDOMNode` sine it will get warning,
   * have to use timer to check if is input element.
   */
  const onInternalInputMouseDown: React.MouseEventHandler<HTMLInputElement> = () => {
    setInputMouseDown(true);
  };

  // When paste come, ignore next onChange
  const pastedTextRef = useRef<string>(null);

  const triggerOnSearch = (value: string) => {
    if (onSearch(value, true, compositionStatusRef.current) !== false) {
      onToggleOpen(true);
    }
  };

  const onInputCompositionStart = () => {
    compositionStatusRef.current = true;
  };

  const onInputCompositionEnd = () => {
    compositionStatusRef.current = false;
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    let {
      target: { value },
    } = event;

    // Pasted text should replace back to origin content
    if (tokenWithEnter && pastedTextRef.current && /[\r\n]/.test(pastedTextRef.current)) {
      // CRLF will be treated as a single space for input element
      const replacedText = pastedTextRef.current.replace(/\r\n/g, ' ').replace(/[\r\n]/g, ' ');
      value = value.replace(replacedText, pastedTextRef.current);
    }

    pastedTextRef.current = null;

    triggerOnSearch(value);
  };

  const onInputPaste: React.ClipboardEventHandler = e => {
    const { clipboardData } = e;
    const value = clipboardData.getData('text');

    pastedTextRef.current = value;
  };

  const onMouseDown: React.MouseEventHandler<HTMLElement> = event => {
    const inputMouseDown = getInputMouseDown();
    if (event.target !== inputRef.current) {
      if (!inputMouseDown) {
        event.preventDefault();
      }
      // Should focus input if click the selector
      const isIE = (document.body.style as any).msTouchAction !== undefined;
      if (isIE) {
        setTimeout(() => {
          inputRef.current.focus();
        });
      } else {
        inputRef.current.focus();
      }
    }

    if ((mode !== 'combobox' && (!showSearch || !inputMouseDown)) || !open) {
      if (open) {
        onSearch('', true, false);
      }
      onToggleOpen();
    }
  };

  // ================= Inner Selector ==================
  const sharedProps = {
    inputRef,
    onInputKeyDown: onInternalInputKeyDown,
    onInputMouseDown: onInternalInputMouseDown,
    onInputChange,
    onInputPaste,
    onInputCompositionStart,
    onInputCompositionEnd,
  };

  const selectNode = (
    <SingleSelector {...props} {...sharedProps} />
  );

  return (
    <div ref={domRef} className={`${prefixCls}-selector`} onMouseDown={onMouseDown}>
      {selectNode}
    </div>
  );
};

const ForwardSelector = React.forwardRef<RefSelectorProps, SelectorProps>(Selector);
ForwardSelector.displayName = 'Selector';

export default ForwardSelector;



