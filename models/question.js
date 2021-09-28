class Question {
    constructor(id,
        uniqueId,
        studentEmail,
        createdDate,
        fee,
        studentId,
        tutorId,
        questionTitle,
        subjectCategory,
        subCategory,
        dueDate,
        description,
        attachments,
        isRefundRequested,
        chatId,
        status,
        isPaid,
        uniqueLink,
        questionSalt,
        studentUniqueKey,
        studentName,
        studentImage,
        tutorName,
        tutorImage,
        sort,
        lastAssignedTutorName,
        lastAssignedTutorImage,
        isQuoteSend,
        isQuoteApproved,
        byLoggedUser,
        questionNumber) {
        this.id = id;
        this.uniqueId = uniqueId;
        this.studentEmail = studentEmail;
        this.createdDate = createdDate;
        this.fee = fee;
        this.studentId = studentId;
        this.tutorId = tutorId;
        this.questionTitle = questionTitle;
        this.subjectCategory = subjectCategory;
        this.subCategory = subCategory;
        this.dueDate = dueDate;
        this.description = description;
        this.attachments = attachments;
        this.isRefundRequested = isRefundRequested;
        this.chatId = chatId;
        this.status = status;
        this.isPaid = isPaid;
        this.uniqueLink = uniqueLink;
        this.questionSalt = questionSalt;
        this.studentUniqueKey = studentUniqueKey;
        this.studentName = studentName;
        this.studentImage = studentImage;
        this.tutorName = tutorName;
        this.tutorImage = tutorImage;
        this.sort = sort;
        this.lastAssignedTutorName = lastAssignedTutorName;
        this.lastAssignedTutorImage = lastAssignedTutorImage;
        this.lastAssignedTutorImage = lastAssignedTutorImage;
        this.isQuoteSend = isQuoteSend;
        this.isQuoteApproved = isQuoteApproved;
        this.byLoggedUser = byLoggedUser;
        this.questionNumber = questionNumber;
    }
}