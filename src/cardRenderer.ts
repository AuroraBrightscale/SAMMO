import { BingoCard } from "./gameLogic";
import { range } from "./util";

export class CardRenderer {
    constructor(private jQuery: JQueryStatic, private html2canvas: Html2CanvasStatic) {}

    public headers = "BINGO";

    async render(card: BingoCard): Promise<string> {
        range(this.headers.length).forEach(i => this.jQuery(`.header-${i}`).text(this.headers[i]));

        card.spaces.forEach((arr, row) => {
            arr.forEach((space, col) => {
                const element = this.jQuery(`.space-${row}-${col}`);
                element.text(space.name);
                if (space.called) {
                    element.parent().addClass("marked");
                } else {
                    element.parent().removeClass("marked");
                }
            });
        });

        const image = await this.html2canvas(this.jQuery(".bingo-card")[0]);
        return image.toDataURL();
    }
}