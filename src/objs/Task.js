export default class Task {
    constructor(
        cover,
        download_link,
        name,
        status,
        task_id,
        // submitTime,
        // objModelUrl,
        // failReason,
    ) {
        this.task_id = task_id;
        this.name = name;
        this.coverUrl = cover;
        this.status = status;
        // this.submitTime = submitTime;
        // this.objModelUrl = objModelUrl;
        // this.failReason = failReason;
        this.download_link = download_link
    }
}

// {
//     "task_id": "newTaskId1",
//     "name": "newTaskName1",
//     "cover_url": "https://someImg1.png",
//     "status": 2,
//     "obj_model_url":"https://someModelUrl1.obj"
// }