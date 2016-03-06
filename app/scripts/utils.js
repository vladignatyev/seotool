function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  let rgb = `${r},${g},${b}`;

  return rgb;
}


class ColorFactory {
  constructor() {
    this.bubble_colors = _.shuffle(['#1a1334', '#26294a', '#01545a', '#017351','#03c383', '#aad962', '#fbbf45', '#ef6a32', '#ed0345', '#a12a5e', '#710162']);
    this.current_color = 0;
  }

  getNewColor(){
    this.current_color = this.current_color % this.bubble_colors.length;
    return hexToRgb(this.bubble_colors[this.current_color++]);
  }
}
