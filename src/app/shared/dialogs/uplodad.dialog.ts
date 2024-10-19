import { Dialogue } from '../models/dialogue.model';

export const uploadDialog: Dialogue[] = [
    {
        text: `Así que te llamas ${localStorage.getItem('name')}, encantado. [/n] No te preocupes, no te arrepentirás de haber firmado... [/n] (Espero que no haya leído los [b]Términos y Condiciones[/b], ¡ja!)`,
        isCharacterVisible: false,
        isEnd: false
    },
    {
        text: 'Bien, vamos al grano. Haz que tu [b]reflejo[/b] aparezca en el espejo, ya sabes, la magia no funciona sin él.',
        isCharacterVisible: false,
        isEnd: false
    }
];

export const uploadError1: Dialogue[] = [
    {
        text: `Parece que el [b]reflejo[/b] que has usado no es válido... ¿Es esto una broma? [/n] Intenta otra vez, no me hagas perder la paciencia.`,
        isCharacterVisible: false,
        isEnd: false
    }
];

export const uploadError2: Dialogue[] = [
    {
        text: `Mmm... Esto es incómodo. ¿Acaso estás intentando engañarme? [/n] No puedo proceder sin un [b]reflejo[/b] adecuado, ¡vamos, pon un poco de esfuerzo!`,
        isCharacterVisible: false,
        isEnd: false
    }
];

export const uploadError3: Dialogue[] = [
    {
        text: `¡GRRRRRRRR! Estás agotando mi paciencia... Esta es tu [b]última oportunidad[/b]. [/n] No me obligues a tomar medidas drásticas.`,
        isCharacterVisible: false,
        isEnd: false
    },
    {
        text: `Tu [b]reflejo[/b] debe ser claro y visible para que la magia funcione, ¿entendido? [/n] [b]Más te vale no intentar engañarme de nuevo... o lo lamentarás.[/b]`,
        isCharacterVisible: false,
        isEnd: false
    }
];
