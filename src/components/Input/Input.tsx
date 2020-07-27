import React, { Component, InputHTMLAttributes } from 'react'
import { composeRef } from '../../utils';

interface i extends InputHTMLAttributes<HTMLElement> {}
type InputRef = HTMLInputElement
export interface InputProps extends InputHTMLAttributes<HTMLInputElement | HTMLElement> {
  // id: string;
  inputElement?: React.ReactElement<any, any>;
  disabled: boolean;
  autoFocus: boolean;
  autoComplete?: string;
  value: string;
  /** Pass accessibility props to input */
  attrs?: object;

  onKeyDown: React.KeyboardEventHandler<HTMLInputElement | HTMLElement>;
  onMouseDown: React.MouseEventHandler<HTMLInputElement | HTMLElement>;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLElement>;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  {
    // id,
    value,
    disabled,
    autoFocus,
    autoComplete,
    onKeyDown,
    onMouseDown,
    onChange,
    onBlur,

    inputElement
  },
  ref,
) => {
  let inputNode: React.ComponentElement<any, any> = inputElement || <input />;

  const {
    ref: originRef,
    props: {
      onKeyDown: onOriginKeyDown,
      onChange: onOriginChange,
      onMouseDown: onOriginMouseDown,
      onBlur: onOriginBlur,
      style,
    },
  } = inputNode;

  inputNode = React.cloneElement(inputNode, {
    // id,
    value,
    style,
    disabled,
    autoFocus,
    autoComplete: autoComplete || 'off',
    ref: composeRef(ref, originRef as any),
    
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown(event);
      if (onOriginKeyDown) {
        onOriginKeyDown(event);
      }
    },
    onMouseDown: (event: React.MouseEvent<HTMLElement>) => {
      onMouseDown(event);
      if (onOriginMouseDown) {
        onOriginMouseDown(event);
      }
    },
    onChange: (event: React.ChangeEvent<HTMLElement>) => {
      onChange(event);
      if (onOriginChange) {
        onOriginChange(event);
      }
    }
  });

  return inputNode;
}

const RefInput = React.forwardRef<InputRef, InputProps>(Input)
RefInput.displayName = 'Input'

export default RefInput
