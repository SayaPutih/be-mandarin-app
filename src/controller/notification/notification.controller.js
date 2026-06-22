import {
  GetReviewNotificationService,
  GetNewUserNotificationService,
} from "../../service/notification/notification.service.js";

export const GetNotificationController = async (req,res)=>{
  console.log("Controller IN");
    try{

        if (
            req.user.role === "ADMIN" ||
            req.user.role === "TEACHER"
        ) {
            console.log(req.user);
            console.log("Teacher Doesnt Get Any Notification");
            return res.status(200).json({
                success: true,
                data: {
                    title: "",
                    message: "",
                    label: "",
                    isNotif: false,
                    type: 3,
                    total: 0,
                },
            });
        }

        const needReview = await GetReviewNotificationService(req.user.id);
        const newUser = await GetNewUserNotificationService(req.user.id);
        
        if (needReview.total > 0){
            return res.status(200).json({
              success: true,
              data: {
                title: "Review Reminder",
                message: `You have ${needReview.total} words ready for review.`,
                label : "Let's Review Them",
                isNotif: true,
                type: 0,
                total: needReview.total,
              },
            });
        }

        if(newUser.total < 20){
            return res.status(200).json({
              success: true,
              data: {
                title: "Welcome to Mandarin LMS",
                message:
                  "Complete the placement test to determine your starting level.",
                label: "Initiate Your Scoring",
                isNotif: true,
                type: 1,
                total: newUser.total,
              },
            });
        }

        return res.status(200).json({
          success: true,
          data: {
            title: "No Notification",
            message: "No Notification",
            label : "",
            isNotif: false,
            type: 3,
            total: 0,
          },
        });
          

    }catch(err){
        return res.status(500).json({message : err.message})
    }
}