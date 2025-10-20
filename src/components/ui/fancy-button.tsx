"use client"

import React from "react"
import styled from "styled-components"

type FancyButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
}

const StyledWrapper = styled.div`
  position: relative;
  display: inline-flex;
  width: 100%;

  svg {
    position: absolute;
    width: 0;
    height: 0;
  }

  .backdrop {
    position: absolute;
    inset: -9900%;
    background: radial-gradient(circle at 50% 50%, #0000 0, #0000 20%, #111111aa 50%);
    background-size: 3px 3px;
    z-index: -1;
  }

  .button {
    position: relative;
    cursor: pointer;
    border: none;
    width: var(--btn-width, 100%);
    height: var(--btn-height, 52px);
    background: #111;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
    transition: transform 0.2s ease;
  }

  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .text {
    position: relative;
    z-index: 1;
  }

  .button::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0;
    background: radial-gradient(circle at 50% 50%, #0000 0, #0000 20%, #111111aa 50%),
      radial-gradient(ellipse 100% 100%, #ffffff, #ffffff00);
    background-size: 3px 3px, auto auto;
    transition: 0.3s;
  }

  .button:hover:not(:disabled)::before {
    opacity: 0.3;
  }

  .a {
    pointer-events: none;
    position: absolute;
    --w: 2px;
    --t: -40px;
    --s: calc(var(--t) * -1);
    --e: calc(100% + var(--t));
    --g: #fff0, #fff3 var(--s), #fffA var(--s), #fff, #fffA var(--e), #fff3 var(--e), #fff0;
  }

  .a::before {
    content: "";
    position: absolute;
    inset: 0;
    background: inherit;
    filter: blur(4px) url(#unopaq);
    z-index: -2;
  }

  .a::after {
    content: "";
    position: absolute;
    inset: 0;
    background: inherit;
    filter: blur(10px) url(#unopaq);
    opacity: 0;
    z-index: -2;
    transition: 0.3s;
  }

  .button:hover:not(:disabled) .a::after {
    opacity: 1;
  }

  .l {
    left: -2px;
  }

  .r {
    right: -2px;
  }

  .l,
  .r {
    background: linear-gradient(var(--g));
    top: var(--t);
    bottom: var(--t);
    width: var(--w);
  }

  .t {
    top: -2px;
  }

  .b {
    bottom: -2px;
  }

  .t,
  .b {
    background: linear-gradient(90deg, var(--g));
    left: var(--t);
    right: var(--t);
    height: var(--w);
  }
`

const FilterSvg = () => (
  <svg aria-hidden>
    <filter width="3000%" x="-1000%" height="3000%" y="-1000%" id="unopaq">
      <feColorMatrix
        values={`1 0 0 0 0
0 1 0 0 0
0 0 1 0 0
0 0 0 3 0`}
      />
    </filter>
  </svg>
)

const FancyButton = React.forwardRef<HTMLButtonElement, FancyButtonProps>(
  ({ children, disabled, ...props }, ref) => {
    return (
      <StyledWrapper data-disabled={disabled ? "true" : "false"}>
        <FilterSvg />
        <div className="backdrop" />
        <button className="button" ref={ref} disabled={disabled} {...props}>
          <div className="a l" />
          <div className="a r" />
          <div className="a t" />
          <div className="a b" />
          <div className="text">{children}</div>
        </button>
      </StyledWrapper>
    )
  }
)

FancyButton.displayName = "FancyButton"

export { FancyButton }
