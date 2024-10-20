import { ToastOptions } from "@ngneat/hot-toast";

export const toastConf: ToastOptions<any> = {
    duration: 5000,
    position: 'top-right',
    autoClose: true,
    style: {
        background: '#212121',
        border: '1px solid #2b2b2b',
    },
};