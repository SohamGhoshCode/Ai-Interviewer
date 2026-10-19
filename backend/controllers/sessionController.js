const Session = require("../models/Session");
const Question = require("../models/Question");
const mongoose = require("mongoose");

// @desc    Create a new session and linked questions
// @route   POST /api/sessions/create
// @access  Private
exports.createSession = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, description, questions } = req.body;
        const userId = req.user._id;  // Assuming you have a middleware setting req.user

        const session = await Session.create({
            user: userId,
            role,
            experience,
            topicsToFocus,
            description,
        });

        const questionDocs = await Promise.all(
            questions.map(async (q) => {
                const question = await Question.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer,
                });
                return question._id;
            })
        );

        session.questions = questionDocs;
        await session.save();

        res.status(201).json({ success: true, session });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};

// @desc    Get all sessions for the logged-in user
// @route   GET /api/sessions/my-sessions
// @access  Private
exports.getMySessions = async (req, res) => {
    try {
        const sessions = await Session.find( { user: req.user.id })
            .sort({ createdAt: -1 })
            .populate("questions");
        res.status(200).json(sessions);
        
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};


// @desc    Get a session by ID with populated questions
// @route   GET /api/sessions/:id
// @access  Private
exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate({
                path: "questions",
                options: { sort: { isPinned: -1, createdAt: 1 }},
            })
            .exec();
        
        if(!session){
            return res.status(404).json({ success: false, message: "Session not found"});
        }
        
        res.status(200).json({ success: true, session });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};


// @desc    Delete a session and its questions
// @route   DELETE /api/sessions/:id
// @access  Private
exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if(!session){
            return res.status(404).json({ message: "Session not found" });
        }

        // Check if the logged-in user owns this session
        if(session.user.toString() !== req.user.id){
            return res.status(401).json({ message: "Not authorized to delete this session" });
        }

        // First, delete all questions linked to this session
        await Question.deleteMany( { session: session._id} );

        // Then, delete the session
        await session.deleteOne();

        res.status(200).json({ message: "Session deleted successfully"});
        
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error"});
    }
};


// @desc    Get aggregated stats for the logged-in user
// @route   GET /api/sessions/stats
// @access  Private
exports.getSessionStats = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);

        const stats = await Session.aggregate([
            // Step 1: Only look at this user's sessions
            { $match: { user: userId } },

            // Step 2: Join with the questions collection
            {
                $lookup: {
                    from: "questions",
                    localField: "_id",
                    foreignField: "session",
                    as: "questionDetails",
                },
            },

            // Step 3: Compute per-session counts
            {
                $addFields: {
                    totalQuestions: { $size: "$questionDetails" },
                    pinnedQuestions: {
                        $size: {
                            $filter: {
                                input: "$questionDetails",
                                as: "q",
                                cond: { $eq: ["$$q.isPinned", true] },
                            },
                        },
                    },
                },
            },

            // Step 4: Roll everything up into a single summary document
            {
                $group: {
                    _id: null,
                    totalSessions: { $sum: 1 },
                    totalQuestions: { $sum: "$totalQuestions" },
                    totalPinnedQuestions: { $sum: "$pinnedQuestions" },
                    // Collect unique roles practiced
                    rolesPracticed: { $addToSet: "$role" },
                },
            },

            // Step 5: Clean up the output (remove the _id: null field)
            {
                $project: {
                    _id: 0,
                    totalSessions: 1,
                    totalQuestions: 1,
                    totalPinnedQuestions: 1,
                    rolesPracticed: 1,
                },
            },
        ]);

        // If the user has no sessions yet, return zeros
        const result = stats[0] || {
            totalSessions: 0,
            totalQuestions: 0,
            totalPinnedQuestions: 0,
            rolesPracticed: [],
        };

        res.status(200).json({ success: true, stats: result });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
