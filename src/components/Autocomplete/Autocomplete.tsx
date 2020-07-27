import React, { FC, useState, RefForwardingComponent, useRef, useLayoutEffect, CSSProperties, createRef } from 'react'
import Input from '../Input/Input'
import { classNames } from '../../utils'

// =================================== Shared Type ===================================
export type Key = string | number;

export type RawValueType = string | number;

export interface LabelValueType {
  key?: Key;
  value?: RawValueType;
  label?: React.ReactNode;
}

interface RefProps {
  focus: () => void;
  blur: () => void;
}

interface Props {
  renderOption?: (item: string) => string;
  options?: string[];
  onSearch?: (value: string) => void; 
  onSelect?: (value: string) => void;
  onChange?: (value: string) => void;

  // Hacks for rest props
  // (value: string) => void

  // Input
  id?: string;
  value?: string
  inputRef?: React.Ref<HTMLInputElement>;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;

  searchValue?: string;

  getInputElement?: () => JSX.Element;

  // onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  // onInputMouseDown?: React.MouseEventHandler<HTMLInputElement>;
  // onInternalInputChange?: React.ChangeEventHandler<HTMLInputElement>;
}

// refs
const containerRef = createRef<HTMLInputElement>()


const BAutoComplete: FC<Props> = (props) => {
  const { 
    options = [],
    onSelect,
    onSearch,
    onChange,
    value,

    placeholder,
    disabled,
    autoFocus,
    autoComplete,
    renderOption,

    getInputElement
  } = props

  // States
  const [innerOpen, setInnerOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [innerSearchValue, setInnerSearchValue] = useState('')
  const [containerWidth, setContainerWidth] = useState<number | string>()
  const mergedDisabled = disabled || false
  const mergedAutoFocus = autoFocus || false
  const mergedSearchValue = value || innerSearchValue

  useLayoutEffect(() => {
    if (innerOpen) {
      const newWidth = containerRef.current?.offsetWidth ?? '100%'
      setContainerWidth(newWidth)
    }
  }, [innerOpen])

  // Elements
  const optionsStyle: CSSProperties = {
    width: containerRef.current?.offsetWidth ?? '100%'
  }

  const isOptionMatched = (index: number, value: string) => (
    activeIndex === index || value === mergedSearchValue
  )

  const renderTemplate = (item: string) => {
    return renderOption ? renderOption(item) : item
  }

  const renderItems = () => (
    <ul className={classNames('options')} style={optionsStyle}>
      {options.map((item, index) => {
        const cnames = classNames('option-item', { 'active': isOptionMatched(index, item) })
        return (
          <li
            key={index}
            className={cnames}
            onClick={() => onSelectItem(item)}
          >
            {renderTemplate(item)}
          </li>
        )
      })}
    </ul>
  )


  // Inner methods
  const onToggleOpen = (newOpen: boolean = true) => {
    setInnerOpen(newOpen)
  }

  const onSelectItem = (option: string) => {
    setInnerSearchValue(option)
    if (onSelect) {
      onSelect(option)
    }

    onToggleOpen(false)
  }

  const triggerOnSearch = (value: string) => {
    if (onSearch) {
      onSearch(value)
    }
    onToggleOpen();
  }


  // Inputs
  const onInternalInputChange: React.ChangeEventHandler<HTMLInputElement> = ({ target: { value }}) => {
    if (onChange) {
      onChange(value)
    }
    setInnerSearchValue(value)
    triggerOnSearch(value)
  }

  const onInternalInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = event => {
    
  }

  const onInternalInputMouseDown = () => {
    onToggleOpen()
  }

  const onInternalInputBlur = () => {
    onToggleOpen(false)
  }

  return (
    <div /* ref={containerRef} */>
      <Input
        ref={inputRef}
        disabled={mergedDisabled}
        autoFocus={mergedAutoFocus}
        autoComplete={autoComplete}
        value={mergedSearchValue}
        onKeyDown={onInternalInputKeyDown}
        onMouseDown={onInternalInputMouseDown}
        onChange={onInternalInputChange}
        onBlur={onInternalInputBlur}
        inputElement={getInputElement ? getInputElement() : undefined}
      />
      {innerOpen && renderItems()}
    </div>
  );
}

export default BAutoComplete
