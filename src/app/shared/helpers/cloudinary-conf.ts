import { Cloudinary } from "@cloudinary/url-gen/index";

export const cloudinaryConf = new Cloudinary({
    cloud: {
        cloudName: 'cloudWilgen'
    }
});