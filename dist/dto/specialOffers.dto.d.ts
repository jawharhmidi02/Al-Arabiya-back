import { SpecialOffer } from 'src/entities/specialOffers.entity';
export declare class SpecialOfferCreate {
    href: string;
    img: string;
}
export declare class SpecialOfferUpdate {
    href: string;
    img: string;
}
export declare class SpecialOfferResponse {
    id: string;
    href: string;
    img: string;
    constructor(specialOffer: SpecialOffer);
}
