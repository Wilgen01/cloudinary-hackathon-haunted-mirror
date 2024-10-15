export interface ImageInfo {
    input:     Size;
    landmarks: Array<Landmark[]>;
    resize:    Resize[];
    output:    Size;
}

export interface Size {
    width:   number;
    height:  number;
    bytes:   number;
    format?: string;
}

export interface Landmark {
    r_eye:    LEye;
    l_eye:    LEye;
    nose_tip: LEye;
    mouth_r:  LEye;
    mouth_l:  LEye;
}

export interface LEye {
    x: number;
    y: number;
}

export interface Resize {
    x:      number;
    y:      number;
    width:  number;
    height: number;
}
