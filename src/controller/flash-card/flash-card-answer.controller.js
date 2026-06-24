import { answerFlashCardQuestionsService } from "../../service/flash-card/flash-card-answer.service.js";
import { getCurrentSystemDate } from "../../repositories/system-config.repository.js";

function deterministicRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const answerFlashCardController = async (req, res) => {
  try {
    const body = req.body;
    const userId = req.user.id;


    const now = await getCurrentSystemDate();
      console.log("NOW : " + now);
      console.log(now);
      console.log(typeof now);
      console.log(now instanceof Date);
    
    
      const seed = userId
        .split("")
        .reduce((sum, c) => sum + c.charCodeAt(0), 0);

      const daySeed = Math.floor(now.getTime() / 86400000);

      const combinedSeed = seed + daySeed;
    
      // now.setHours((seed % 12) + 8); // jam 08-19
      // now.setMinutes(seed % 60);
      // now.setSeconds(0);
    
      // console.log("--------------------------------------")
      // console.log(now)
      const rand = deterministicRandom(combinedSeed);

      const hour = 8 + Math.floor(rand * 12);

      const minute = Math.floor(rand * 60);

      const second = Math.floor(rand * 60);

      now.setHours(hour);
      now.setMinutes(minute);
      now.setSeconds(second);

    // BULK
    if (Array.isArray(body.answers)) {
      const results = [];

      for (const item of body.answers) {
        const result = await answerFlashCardQuestionsService(
          userId,
          item.wordId,
          item.answer,
          item.expected_answer,
          item.answerTimeMs,
          now,
        );

        results.push(result);
      }

      return res.status(200).json({
        success: true,
        data: results,
      });
    }

    // SINGLE
    const result = await answerFlashCardQuestionsService(
      userId,
      body.wordId,
      body.answer,
      body.expected_answer,
      body.answerTimeMs,
      now,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};


/*

INSERT INTO "SystemConfig"
(id, "currentReviewDate")
VALUES
(
 gen_random_uuid(),
 NOW()
);


UPDATE "SystemConfig"
SET "currentReviewDate" =
    "currentReviewDate" + INTERVAL '14 days';


DELETE FROM "SystemConfig";
*/