// eslint-disable-next-line no-undef
export const createHTMLMapMarker = ({ OverlayView = google.maps.OverlayView,  ...args }) => {
  class HTMLMapMarker extends OverlayView {
    constructor() {
      super();
      this.latlng = args.latlng;
      this.html = args.html;
      this.setMap(args.map);
    }

    createDiv() {
      this.div = document.createElement('div');
      this.div.style.position = 'absolute';
      this.div.style.width = '30px';
      this.div.style.height = '30px';
      this.div.className = 'map-marker-wrapper'
      if (this.html) {
        this.div.innerHTML = this.html;
      }

      // this.div.addEventListener("onmouseenter", () => {
      //   console.log('onmouseenter');
      //   // map.setCenter(marker.getPosition() as google.maps.LatLng);
      // });

      // this.div.addEventListener("onmouseout", () => {
      //   console.log('onmouseout');
      //   // map.setCenter(marker.getPosition() as google.maps.LatLng);
      // });

      // // maps.event.addDomListener(this.div, 'click', event => {
      // //   maps.event.trigger(this, 'click');
      // // });
    }

    appendDivToOverlay() {
      const panes = this.getPanes();
      panes.overlayLayer.appendChild(this.div);
    }

    positionDiv() {
      const point = this.getProjection().fromLatLngToDivPixel(this.latlng);
      if (point) {
        this.div.style.left = `${point.x}px`;
        this.div.style.top = `${point.y}px`;
      }
    }

    draw() {
      if (!this.div) {
        this.createDiv();
        this.appendDivToOverlay();
      }
      this.positionDiv();
    }

    remove() {
      if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
    }

    getPosition() {
      return this.latlng;
    }

    getDraggable() {
      return false;
    }
  } 
  return new HTMLMapMarker();
};

export default createHTMLMapMarker;