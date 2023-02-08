export type NumObj = {
    [key: string]: number;
};

export type StrObj = {
    [key: string]: string;
};

export type ScoreObj = {
    quiz: string;
    scores: NumObj;
}

type QuizObj = {
    name: string;
    url: string;
}

export type QuizParams = {
    axes: string[];
    version: string;
    canvasParams: CanvasParams;
    buttons: {
        [key: string]: {
            text: string;
            weight: number;
        }
    };
    quizzes: {
        [key: string]: QuizObj;
    };
    colors: StrObj;
    labels: StrObj;
    images: StrObj;
}

export type Question = {
    question: string;
    effect: {
        [key: string]: number;
    }
}

export type ScoreList = {
    [key: string]: number[];
}

//new
export type CanvasParams = {
    height: number;
    width: number;
    bg: string;
    fg: string;
    titleFont: string;
    bodyFont: string;
}

export type HeaderParams = {
    title: string;
    url: string;
    version: string;
    edition: string;
}

declare global {
    interface globalThis {
        VERSION: string;
    }
}

