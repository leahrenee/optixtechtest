export type Movie = {
    id: string;
    reviews: number[];
    title: string;
    filmCompanyId: string;
    cost: number;
    releaseYear: number;
}

export type MovieCompany = {
    id: string;
    name: string;
}