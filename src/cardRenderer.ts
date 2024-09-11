import { BingoCard } from "./gameLogic";
import { range } from "./util";

export class CardRenderer {
    constructor (
        private jQuery: JQueryStatic, 
        private html2canvas: Html2CanvasStatic, 
        public headers = "BINGO",
    ) {}

    async render(
        card: BingoCard, 
        displayName: string, 
        profileImage: string | undefined, 
        color: string,
    ): Promise<string> {
        //Set profile
        this.jQuery(".name-insert span").text(displayName);
        this.jQuery(".name-insert").css("background-color", `#${color}`);
        if (profileImage) {
            this.jQuery(".name-insert img")
                .css("display", "inherit")
                .attr("src", profileImage);
        } else {
            this.jQuery(".name-insert img").css("display", "none");
        }

        //Set card headers
        range(this.headers.length).forEach(i => this.jQuery(`.header-${i}`).text(this.headers[i]));

        //Set card spaces
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

        //Take the picture!
        const returnPromise = new Promise<string>(res => {;
        setTimeout(async () => {
            const cardImage = await this.html2canvas(
                this.jQuery(".bingo-card")[0], { allowTaint: true, useCORS: true }
            );
            res(cardImage.toDataURL());
        }, 0);
    });
        return returnPromise;
    }
}