const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '제목은 필수입니다.'],
    trim: true,
    minlength: [1, '제목은 최소 1자 이상이어야 합니다.'],
    maxlength: [200, '제목은 최대 200자까지 가능합니다.']
  },
  content: {
    type: String,
    required: [true, '내용은 필수입니다.'],
    trim: true,
    minlength: [1, '내용은 최소 1자 이상이어야 합니다.'],
    maxlength: [10000, '내용은 최대 10000자까지 가능합니다.']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, '카테고리는 필수입니다.'],
    enum: ['일반', '질문', '정보', '후기', '잡담', '공지사항'],
    default: '일반'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, '태그는 최대 20자까지 가능합니다.']
  }],
  images: [{
    type: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
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
postSchema.index({ title: 'text', content: 'text' });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ isPinned: 1, createdAt: -1 });

// 가상 필드: 좋아요 수
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// 가상 필드: 싫어요 수
postSchema.virtual('dislikeCount').get(function() {
  return this.dislikes.length;
});

// 가상 필드: 댓글 수 (populate로 계산)
postSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true
});

// JSON 변환 시 가상 필드 포함
postSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.reportedBy;
    delete ret.moderationStatus;
    delete ret.moderationNote;
    return ret;
  }
});

// 좋아요/싫어요 토글 메서드
postSchema.methods.toggleLike = function(userId) {
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

postSchema.methods.toggleDislike = function(userId) {
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

// 조회수 증가
postSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// 신고 추가
postSchema.methods.addReport = function(userId, reason, description) {
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

module.exports = mongoose.model('Post', postSchema); 