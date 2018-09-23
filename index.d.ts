/*
2016 : Laurent Bernabé
*/

export class DURATION {
    static SHORT:string;
    static LONG:string;
}

export class POSITION {
    static TOP:string;
    static CENTER:string;
    static BOTTOM:string;
}

export interface ToastOptionsIOS {
  title?: string;
  image?: string;
  color?: string;
  useGlobalStyle?: boolean;
  tapToDismiss?: boolean;
}

export interface ToastOptions {
    text: string;
    duration: DURATION;
    position?: POSITION;
    // iOS only
    ios?: ToastOptionsIOS;
}

export function show(toastObject: ToastOptions)
