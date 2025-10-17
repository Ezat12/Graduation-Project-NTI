const Order = require("../models/order");
const Course = require("../models/course");
const User = require("../models/user.model");
const CourseStudent = require("../models/StudentCourse");
const asyncErrorHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createOrder = async (session) => {
  const user = await User.findOne({ email: session.customer_email });
  const course = await Course.findById(session.client_reference_id);
  const courseStudent = await CourseStudent.findOne({ userId: user._id });

  console.log("Creating order for user:", user);
  console.log("Course details:", course);
  console.log("CourseStudent details:", courseStudent);

  const price = session.amount_total / 100;

  if (!user || !course) {
    return res
      .status(404)
      .json({ message: "User, Course or Enrollment not found" });
  }

  const isEnrolled = courseStudent.courses.includes(course._id);
  if (isEnrolled) {
    return res
      .status(400)
      .json({ message: "User is already enrolled in this course" });
  }

  // Create the order
  const order = await Order.create({
    userId: user._id,
    courseId: course._id,
    totalAmount: price,
  });

  course.enrollments++;

  courseStudent.courses.push(course._id);
  await courseStudent.save();
  await course.save();

  return order;
};

const getCheckoutSession = asyncErrorHandler(async (req, res, next) => {
  const idCourse = req.params.courseId;

  const course = await Course.findById(idCourse);
  if (!course) {
    return next(new ApiError(`not found course by id => ${idCourse}`, 404));
  }

  const studentCoursesToUser = await CourseStudent.findOne({
    user: req.user._id,
  });

  const coursesStudent = studentCoursesToUser?.courses;

  const checkCourse = coursesStudent?.some(
    (c) => c.course._id.toString() === idCourse
  );

  if (checkCourse) {
    return next(new ApiError("you already have the course", 400));
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: course.price * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.SERVER_URL}/course-progress/${req.params.courseId}`,
    cancel_url: `${process.env.SERVER_URL}/courses/details/${req.params.courseId}`,
    customer_email: req.user.email,
    client_reference_id: req.params.courseId,
  });

  res.status(200).json({ status: "success", data: session });
});

const webhookCheckout = asyncErrorHandler(async (req, res, next) => {
  console.log("Webhook received:", req.body);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_END_POINT_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    try {
      const result = await createOrder(event.data.object);
      return res.status(200).json({ status: "success", data: result });
    } catch (err) {
      console.error("Error in createOrder:", err);
      return res.status(500).json({ status: "error", message: err.message });
    }
  } else {
    return res
      .status(400)
      .json({ status: "error", message: "unhandled event type" });
  }
});

module.exports = {
  getCheckoutSession,
  webhookCheckout,
};
