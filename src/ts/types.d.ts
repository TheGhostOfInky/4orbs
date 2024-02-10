export type ScoreObj = {
    quiz: string;
    scores: Record<string, number>;
}

type QuizObj = {
    name: string;
    url: string;
}

export type QuizButton = {
    text: string;
    weight: number;
};

export type QuizParams = {
    axes: string[];
    version: string;
    canvasParams: CanvasParams;
    buttons: Record<string, QuizButton>;
    quizzes: Record<string, QuizObj>;
    colors: Record<string, string>;
    labels: Record<string, string>;
    images: Record<string, string>;
}

export type Question = {
    question: string;
    effect: Record<string, number>;
}

//DEPRECATED
export type ScoreList = Record<string, number[]>;

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

