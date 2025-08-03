const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, '댓글 내용은 필수입니다.'],
    trim: true,
    minlength: [1, '댓글 내용은 최소 1자 이상이어야 합니다.'],
    maxlength: [2000, '댓글 내용은 최대 2000자까지 가능합니다.']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reportedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['스팸', '부적절한 내용', '폭력', '기타'],
      required: true
    },
    description: String,
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  moderationNote: String
}, {
  timestamps: true
});

// 인덱스 설정
commentSchema.index({ post: 1, createdAt: 1 });
commentSchema.index({ author: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1, createdAt: 1 });

// 가상 필드: 좋아요 수
commentSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// 가상 필드: 싫어요 수
commentSchema.virtual('dislikeCount').get(function() {
  return this.dislikes.length;
});

// JSON 변환 시 가상 필드 포함
commentSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    if (ret.isDeleted) {
      ret.content = '[삭제된 댓글입니다]';
      ret.author = null;
    }
    delete ret.reportedBy;
    delete ret.moderationStatus;
    delete ret.moderationNote;
    return ret;
  }
});

// 좋아요/싫어요 토글 메서드
commentSchema.methods.toggleLike = function(userId) {
  const likeIndex = this.likes.indexOf(userId);
  const dislikeIndex = this.dislikes.indexOf(userId);
  
  if (likeIndex > -1) {
    this.likes.splice(likeIndex, 1);
  } else {
    this.likes.push(userId);
    if (dislikeIndex > -1) {
      this.dislikes.splice(dislikeIndex, 1);
    }
  }
  
  return this.save();
};

commentSchema.methods.toggleDislike = function(userId) {
  const likeIndex = this.likes.indexOf(userId);
  const dislikeIndex = this.dislikes.indexOf(userId);
  
  if (dislikeIndex > -1) {
    this.dislikes.splice(dislikeIndex, 1);
  } else {
    this.dislikes.push(userId);
    if (likeIndex > -1) {
      this.likes.splice(likeIndex, 1);
    }
  }
  
  return this.save();
};

// 댓글 삭제 (소프트 삭제)
commentSchema.methods.softDelete = function(userId) {
  this.isDeleted = true;
  this.deletedAt = Date.now();
  this.deletedBy = userId;
  this.content = '[삭제된 댓글입니다]';
  return this.save();
};

// 신고 추가
commentSchema.methods.addReport = function(userId, reason, description) {
  const existingReport = this.reportedBy.find(report => 
    report.user.toString() === userId.toString()
  );
  
  if (existingReport) {
    return Promise.resolve(this);
  }
  
  this.reportedBy.push({
    user: userId,
    reason,
    description
  });
  
  return this.save();
};

module.exports = mongoose.model('Comment', commentSchema); 