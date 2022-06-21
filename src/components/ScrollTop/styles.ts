import styled, { css } from 'styled-components';

interface Props {
    readonly light: boolean
}

export const Wrapper = styled.div<Props>`
    position: fixed;
    border-radius: 25px;
    bottom: 50px;
    right: 50px;
    width: 50px;
    height: 50px;
    line-height: 55px;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    font-size: 175%;
    color: ${props => (props.light ? '#ffffff' : '#6c6c6c')};
    z-index: 999;
    &:hover {
        ${(props) => props.light ? css` background: rgba(255, 255, 255, .5)` : css` background: rgba(61, 67, 81, .5); `}
    }
`;

export const Icon = styled.i<Props>`
    transform: rotate(-135deg);
    border: solid;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 8px;
    font-style: italic;
    color: ${props => (props.light ? '#ffffff' : '#191919')};
    line-height: 30px;
    text-decoration: none;
    text-align: center;
    cursor: pointer;
    font-size: 175%;
    ${Wrapper}:hover & {
        color: #000;
    }
`;