const mongoose = require('mongoose');
const user = require('./userModel');
const slugify = require('slugify');

const testSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'MUST have a NAME'],
      unique: true,
    },
    duration: {
      type: Number,
      default: 5,
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'MUST have a GROUPNAME'],
    },
    difficulty: {
      type: String,
      required: [true, 'MUST have a DIFFICULTY'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.7,
    },
    ratingsQuantity: {
      type: Number,
      default: 37,
    },
    price: {
      type: Number,
      default: 650,
    },
    summary: {
      type: String,
      required: [true, 'MUST have a DIFFICULTY'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'MUST have a DIFFICULTY'],
      trim: true,
    },
    imageCover: [String],
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    slug: String,
    startDates: [Date],
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

testSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

testSchema.virtual('reviews', {
  ref: 'review',
  foreignField: 'tour',
  localField: '_id',
});

const ModalSchema = mongoose.model('travel', testSchema);

module.exports = ModalSchema;
