import React, { RefForwardingComponent, FC, useState } from "react"
import { LabelValueType } from "../Autocomplete/Autocomplete"
import Input from '../Input/Input'


interface SelectorProps {
  id: string;

  inputRef: React.Ref<HTMLInputElement>;
  placeholder?: React.ReactNode;
  disabled?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  values: LabelValueType[];
  searchValue: string;

  onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onInputMouseDown: React.MouseEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onInputChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;

  inputElement: React.ReactElement;
  activeValue: string;
}

const SingleSelector: FC<SelectorProps> = props => {
  const {
    inputElement,
    id,
    inputRef,
    disabled = false,
    autoFocus = false,
    autoComplete,
    values,
    placeholder,

    searchValue,
    activeValue,

    onInputKeyDown,
    onInputMouseDown,
    onInputChange,
  } = props;

  const [inputChanged, setInputChanged] = useState(false)

  const item = values[0]

  let inputValue: string = searchValue || ''
  if (activeValue && !inputChanged) {
    inputValue = activeValue
  }

  React.useEffect(() => {
    setInputChanged(false);
  }, [activeValue])

  const hasTextInput = !!inputValue

  return (
    <>
      <span className={`selection-search`}>
        <Input
          ref={inputRef}
          id={id}
          inputElement={inputElement}
          disabled={disabled}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          value={inputValue}
          onKeyDown={onInputKeyDown}
          onMouseDown={onInputMouseDown}
          onChange={e => {
            setInputChanged(true);
            onInputChange(e as any);
          }}
        />
      </span>

      {/* Placeholder */}
      {!item && !hasTextInput && (
        <span className={`selection-placeholder`}>{placeholder}</span>
      )}
    </>
  )
}

export default SingleSelector
