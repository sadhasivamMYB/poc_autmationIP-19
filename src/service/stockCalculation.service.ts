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

        let opening =
            data.openingCases * data.bottlePerCase +
            data.openingBottles;

        let received =
            data.receivedCases * data.bottlePerCase +
            data.receivedBottles;

        let issued =
            data.issuedCases * data.bottlePerCase +
            data.issuedBottles;

        let total =
            opening +
            received -
            issued;

        const cases =
            Math.floor(
                total / data.bottlePerCase
            );

        const bottles =
            total % data.bottlePerCase;

        return {

            cases,

            bottles,

        };

    }

}