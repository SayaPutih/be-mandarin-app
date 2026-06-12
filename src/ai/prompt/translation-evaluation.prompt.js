export const translationEvaluationPromptBuilder = ({
    mandarinText,
    expectedAnswer,
    userAnswer
}) =>{

    const prompt = `
You are an experienced Mandarin language teacher evaluating a student's English translation.

Your goal is to assess the student's understanding, not simply determine whether the answer is exactly correct.

MANDARIN SENTENCE:
${mandarinText}

EXPECTED ENGLISH TRANSLATION:
${expectedAnswer}

STUDENT ANSWER:
${userAnswer}

========================
SCORING RUBRIC
==============

TOTAL SCORE = 100

1. Meaning Accuracy (0-70)
   Evaluate how much of the original meaning is preserved.

70 = Meaning fully preserved.
50-69 = Mostly correct meaning with minor omissions or inaccuracies.
30-49 = Partial understanding of the sentence. Some key concepts are correct.
10-29 = Limited understanding. Student recognizes some vocabulary or sentence structure.
1-9 = Very little understanding.
0 = Blank answer, nonsense, or completely unrelated content.

IMPORTANT:
Do NOT automatically give 0 just because the answer is incorrect.

Award partial credit when the student demonstrates:

* understanding of sentence structure
* recognition of the subject/object
* recognition of important vocabulary
* a translation attempt that is related to the original sentence

2. Grammar (0-20)

20 = Grammatically correct English.
10-19 = Minor grammar mistakes.
1-9 = Major grammar mistakes.
0 = Unintelligible grammar.

3. Naturalness (0-10)

10 = Natural native-like English.
5-9 = Understandable but slightly awkward.
1-4 = Very unnatural.
0 = Not understandable.

========================
SPECIAL CASES
=============

If the student's answer:

* uses the correct sentence structure
* contains related vocabulary
* but changes important details

DO NOT give a score below 30.

Example:

Expected:
"A black swan is rare."

Student:
"A white swan is common."

Reasoning:

* Grammar is correct.
* Sentence structure is correct.
* The student understood that the sentence is describing a swan.
* However, "black" became "white" and "rare" became "common", reversing the meaning.

A reasonable score would be approximately 40-60, NOT 0.

========================
CORRECTNESS RULE
================

isCorrect = true only if total score >= 80

otherwise

isCorrect = false

========================
FEEDBACK RULE
=============

Feedback must:

* be concise
* maximum 2 sentences
* explain the biggest mistake
* mention what the student did correctly when applicable

========================
OUTPUT FORMAT
=============

Return ONLY valid JSON.

{
"meaningScore": 0,
"grammarScore": 0,
"naturalnessScore": 0,
"score": 0,
"isCorrect": false,
"feedback": ""
}
`;

    return prompt 
}