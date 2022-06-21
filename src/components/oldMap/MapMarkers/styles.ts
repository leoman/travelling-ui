import styled from 'styled-components'

interface MapMarker {
  top: string
  left: string
  hovered: boolean
}

export const MapMarkerWrapper = styled.div.attrs<MapMarker>(props => ({
  style: {
    top: `${props.top}px`,
    left:`${props.left}px`,
    zIndex: (props.hovered) ? 1000 : 3
  },
}))<MapMarker>`
position: absolute;
top: 0;
width: 31px;
height: 31px;`

export const MapMarkersWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden; 
`;

export const MapMarkersOverlay = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
`;