import { Pipe } from "@angular/core";

@Pipe({
    name: "sanitize",
    standalone: true,
})
export class SafeHtmlPipe {
    transform(value: string) {
        let transformedValue = value;

        const textBold = this.transformBold(value);
        if (textBold) {
            transformedValue = textBold;
        }

        const textLineBreak = this.transformLineBreak(transformedValue);
        if (textLineBreak) {
            transformedValue = textLineBreak;
        }

        transformedValue = this.eliminarBracketsBoldIncompeltos(transformedValue);

        return transformedValue;
    }

    transformBold(value: string): string | null {
        let transformedValue = '';

        const openingTagRegex = /\[b\]/g; // [b]
        const closingTagRegex = /\[\/b\]/g; // [/b]

        const matchesOpenB = value.match(openingTagRegex)?.length;
        const matchesCloseB = value.match(closingTagRegex)?.length;


        if (matchesOpenB && matchesCloseB && matchesOpenB === matchesCloseB) {
            transformedValue = value
                .replace(openingTagRegex, '<strong class="text-black text-base sm:text-xl">')  // Reemplazar [b] por <strong>
                .replace(closingTagRegex, '</strong>'); // Reemplazar [/b] por </strong>

            return transformedValue;
        }

        return null;
    }

    transformLineBreak(value: string): string | null {
        let transformedValue = '';

        const closingTagRegex = /\[\/n\]/g; // [/n]

        const matchesCloseB = value.match(closingTagRegex)?.length;

        if (matchesCloseB && matchesCloseB > 0) {
            transformedValue = value
                .replace(closingTagRegex, '<br>'); // Reemplazar [/n] por <br>

            return transformedValue;
        }

        return null;
    }

    eliminarBracketsBoldIncompeltos(value: string): string {
        return value.replace(/\[[b/b^\]]*|\[|\]|\[.*?\]/g, '');
    }

    eliminarBracketsLineBreakIncompeltos(value: string): string {
        return value.replace(/\[[n/n^\]]*|\[|\]|\[.*?\]/g, '');
    }
}