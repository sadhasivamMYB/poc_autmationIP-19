export class StockCalculationService {

    static calculateClosing(data: {

        openingCases: number;

        openingBottles: number;

        receivedCases: number;

        receivedBottles: number;

        issuedCases: number;

        issuedBottles: number;

        bottlePerCase: number;

    }) {

        const openingCases = Number(data.openingCases) || 0;
        const openingBottles = Number(data.openingBottles) || 0;
        const receivedCases = Number(data.receivedCases) || 0;
        const receivedBottles = Number(data.receivedBottles) || 0;
        const issuedCases = Number(data.issuedCases) || 0;
        const issuedBottles = Number(data.issuedBottles) || 0;
        const bottlePerCase = Number(data.bottlePerCase) || 1; // Default to 1 to prevent division by zero/NaN

        let opening =
            openingCases * bottlePerCase +
            openingBottles;

        let received =
            receivedCases * bottlePerCase +
            receivedBottles;

        let issued =
            issuedCases * bottlePerCase +
            issuedBottles;

        let total =
            opening +
            received -
            issued;

        const cases =
            Math.floor(
                total / bottlePerCase
            );

        const bottles =
            total % bottlePerCase;

        return {

            cases,

            bottles,

        };

    }

}