export type score = {
    [key: string]: number;
}

export type param = {
    axes: Array<string>;
    buttons: {
        [key: string]: {
            text: string;
            weight: number;
        }
    };
    quizzes : {
        [key: string]: {
            name: string;
            url: string;
        }
    }
    colors: {
        [key: string]: Array<string>;
    };
    labels: {
        [key: string]: Array<string>;
    };
    images: {
        [key: string]: Array<string>;
    };
}

export type question = {
    question: string;
    effect: {
        [key: string]: number;
    }
}

export type scoreList = {
    [key: string]: Array<number>
}