import {parseToRgba, rgba, toHex} from "color2k"

export const randomColor = (): string => {
    return toHex(rgba(
        Math.random()*255,
        Math.random()*255,
        Math.random()*255,
        1
    ))
}

export const getOpacity = (colorString: string) => {
    try {
        const opacity = Math.ceil(parseToRgba(colorString)[3] * 100)
        return `${opacity}%`
    }
    catch (err) {
        return `100%`
    }
}