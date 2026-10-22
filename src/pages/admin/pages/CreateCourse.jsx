import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCourseAsync } from "../../../store/slices/adminSlice";
import { useNavigate } from "react-router-dom";

export default function CreateCourse() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { creating, success, error } = useSelector((state) => state.admin);

    const [form, setForm] = useState({
        title: "",
        description: "",
        instructorName: "",
        price: 0,
        category: "",
        tags: "",
        batches: [],
        syllabus: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === "price" ? Number(value) : value,
        });
    };

    const addBatch = () => {
        setForm((s) => ({
            ...s,
            batches: [...s.batches, { name: "", startDate: "" }],
        }));
    };

    const removeBatch = (idx) => {
        setForm((s) => ({
            ...s,
            batches: s.batches.filter((_, i) => i !== idx),
        }));
    };

    const updateBatch = (idx, field, value) => {
        setForm((s) => {
            const newBatches = [...s.batches];
            newBatches[idx] = { ...newBatches[idx], [field]: value };
            return { ...s, batches: newBatches };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            tags: form.tags
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t),
            batches: form.batches.map(b => ({
                ...b,
                startDate: b.startDate ? new Date(b.startDate) : undefined
            })),
            syllabus: form.syllabus,
        };

        dispatch(createCourseAsync(payload)).then((result) => {
            if (!result.payload?.message && !error) {
                setTimeout(() => navigate("/admin/courses"), 1500);
            }
        });
    };

    if (success) {
        return (
            <div className="alert alert-success">
                <span>{success}</span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl w-full mx-auto pb-12">
            <h1 className="page-heading mb-6 sm:mb-8">Create New Course</h1>

            {error && (
                <div className="alert alert-error mb-6">
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Course Basic Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Course Title - Full Width */}
                    <div className="form-control flex flex-col gap-1.5 w-full md:col-span-2">
                        <label className="label p-0 justify-start">
                            <span className="label-text font-semibold">Course Title *</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter course title"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    {/* Description - Full Width */}
                    <div className="form-control flex flex-col gap-1.5 w-full md:col-span-2">
                        <label className="label p-0 justify-start">
                            <span className="label-text font-semibold">Description *</span>
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Course description"
                            className="textarea textarea-bordered h-28 w-full"
                            required
                        />
                    </div>

                    {/* Instructor Name - Col 1 */}
                    <div className="form-control flex flex-col gap-1.5 w-full">
                        <label className="label p-0 justify-start">
                            <span className="label-text font-semibold">Instructor Name *</span>
                        </label>
                        <input
                            type="text"
                            name="instructorName"
                            value={form.instructorName}
                            onChange={handleChange}
                            placeholder="Instructor name"
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    {/* Price - Col 2 */}
                    <div className="form-control flex flex-col gap-1.5 w-full">
                        <label className="label p-0 justify-start">
                            <span className="label-text font-semibold">Price (৳) *</span>
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="Price in taka"
                            className="input input-bordered w-full"
                            min="0"
                            required
                        />
                    </div>

                    {/* Category - Col 1 */}
                    <div className="form-control flex flex-col gap-1.5 w-full">
                        <label className="label p-0 justify-start">
                            <span className="label-text font-semibold">Category</span>
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            placeholder="e.g., Web Development"
                            className="input input-bordered w-full"
                        />
                    </div>

                    {/* Tags - Col 2 */}
                    <div className="form-control flex flex-col gap-1.5 w-full">
                        <label className="label p-0 justify-start">
                            <span className="label-text font-semibold">Tags (comma separated)</span>
                        </label>
                        <input
                            type="text"
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            placeholder="react, javascript, web"
                            className="input input-bordered w-full"
                        />
                    </div>
                </div>

                {/* Syllabus Section */}
                <div className="divider my-6 sm:my-8 font-semibold text-base sm:text-lg">
                    Course Syllabus (Modules & Lessons)
                </div>
                <div className="space-y-4 sm:space-y-6">
                    {form.syllabus.map((module, modIdx) => (
                        <div key={modIdx} className="card bg-base-100 border border-base-300 shadow-sm">
                            <div className="card-body p-4 sm:p-6 space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-base-200">
                                    <h3 className="font-bold text-lg">Module {modIdx + 1}</h3>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newSyllabus = form.syllabus.filter((_, i) => i !== modIdx);
                                            setForm({ ...form, syllabus: newSyllabus });
                                        }}
                                        className="btn btn-sm btn-error"
                                    >
                                        Remove Module
                                    </button>
                                </div>

                                <div className="form-control flex flex-col gap-1.5 w-full">
                                    <label className="label p-0 justify-start">
                                        <span className="label-text font-semibold">Module Title *</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={module.title}
                                        onChange={(e) => {
                                            const newSyllabus = [...form.syllabus];
                                            newSyllabus[modIdx].title = e.target.value;
                                            setForm({ ...form, syllabus: newSyllabus });
                                        }}
                                        placeholder="e.g., Introduction to React"
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Lessons */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-semibold text-base">Lessons</h4>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newSyllabus = [...form.syllabus];
                                                if (!newSyllabus[modIdx].lessons) {
                                                    newSyllabus[modIdx].lessons = [];
                                                }
                                                newSyllabus[modIdx].lessons.push({
                                                    title: "",
                                                    videoUrl: "",
                                                    liveClassLink: "",
                                                    liveClassDate: "",
                                                    assignmentPrompt: "",
                                                    quiz: [],
                                                });
                                                setForm({ ...form, syllabus: newSyllabus });
                                            }}
                                            className="btn btn-sm btn-outline"
                                        >
                                            + Add Lesson
                                        </button>
                                    </div>

                                    {module.lessons?.map((lesson, lesIdx) => (
                                        <div key={lesIdx} className="card bg-base-200/60 border border-base-300">
                                            <div className="card-body p-4 sm:p-5 space-y-4">
                                                <div className="flex justify-between items-center pb-2 border-b border-base-300/50">
                                                    <h5 className="font-semibold text-sm">Lesson {lesIdx + 1}</h5>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newSyllabus = [...form.syllabus];
                                                            newSyllabus[modIdx].lessons = newSyllabus[modIdx].lessons.filter((_, i) => i !== lesIdx);
                                                            setForm({ ...form, syllabus: newSyllabus });
                                                        }}
                                                        className="btn btn-xs btn-error"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="form-control flex flex-col gap-1.5 w-full">
                                                        <label className="label p-0 justify-start">
                                                            <span className="label-text font-semibold">Lesson Title *</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={lesson?.title || ""}
                                                            onChange={(e) => {
                                                                const newSyllabus = form.syllabus.map((mod, mIdx) => {
                                                                    if (mIdx === modIdx) {
                                                                        const newLessons = mod.lessons.map((les, lIdx) => {
                                                                            if (lIdx === lesIdx) {
                                                                                return { ...les, title: e.target.value };
                                                                            }
                                                                            return les;
                                                                        });
                                                                        return { ...mod, lessons: newLessons };
                                                                    }
                                                                    return mod;
                                                                });
                                                                setForm({ ...form, syllabus: newSyllabus });
                                                            }}
                                                            placeholder="e.g., Setting up React"
                                                            className="input input-bordered input-sm w-full"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="form-control flex flex-col gap-1.5 w-full">
                                                        <label className="label p-0 justify-start">
                                                            <span className="label-text font-semibold">Video URL (YouTube) *</span>
                                                        </label>
                                                        <input
                                                            type="url"
                                                            value={lesson?.videoUrl || ""}
                                                            onChange={(e) => {
                                                                const newSyllabus = form.syllabus.map((mod, mIdx) => {
                                                                    if (mIdx === modIdx) {
                                                                        const newLessons = mod.lessons.map((les, lIdx) => {
                                                                            if (lIdx === lesIdx) {
                                                                                return { ...les, videoUrl: e.target.value };
                                                                            }
                                                                            return les;
                                                                        });
                                                                        return { ...mod, lessons: newLessons };
                                                                    }
                                                                    return mod;
                                                                });
                                                                setForm({ ...form, syllabus: newSyllabus });
                                                            }}
                                                            placeholder="https://www.youtube.com/watch?v=..."
                                                            className="input input-bordered input-sm w-full"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                {/* Live Class Section */}
                                                <div className="form-control flex flex-col gap-2 w-full pt-1">
                                                    <div className="flex justify-between items-center">
                                                        <label className="label p-0 justify-start">
                                                            <span className="label-text font-semibold">Live Class (Optional)</span>
                                                        </label>
                                                        {!lesson?.liveClassLink ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newSyllabus = form.syllabus.map((mod, mIdx) => {
                                                                        if (mIdx === modIdx) {
                                                                            const newLessons = mod.lessons.map((les, lIdx) => {
                                                                                if (lIdx === lesIdx) {
                                                                                    return {
                                                                                        ...les,
                                                                                        liveClassLink: "",
                                                                                        liveClassDate: ""
                                                                                    };
                                                                                }
                                                                                return les;
                                                                            });
                                                                            return { ...mod, lessons: newLessons };
                                                                        }
                                                                        return mod;
                                                                    });
                                                                    setForm({ ...form, syllabus: newSyllabus });
                                                                }}
                                                                className="btn btn-sm btn-outline btn-info"
                                                            >
                                                                + Add Live Class
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newSyllabus = form.syllabus.map((mod, mIdx) => {
                                                                        if (mIdx === modIdx) {
                                                                            const newLessons = mod.lessons.map((les, lIdx) => {
                                                                                if (lIdx === lesIdx) {
                                                                                    const { liveClassLink, liveClassDate, ...rest } = les;
                                                                                    return rest;
                                                                                }
                                                                                return les;
                                                                            });
                                                                            return { ...mod, lessons: newLessons };
                                                                        }
                                                                        return mod;
                                                                    });
                                                                    setForm({ ...form, syllabus: newSyllabus });
                                                                }}
                                                                className="btn btn-sm btn-ghost btn-error"
                                                            >
                                                                Remove Live Class
                                                            </button>
                                                        )}
                                                    </div>
                                                    {lesson?.liveClassLink !== undefined && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <input
                                                                type="url"
                                                                value={lesson?.liveClassLink || ""}
                                                                onChange={(e) => {
                                                                    const newSyllabus = form.syllabus.map((mod, mIdx) => {
                                                                        if (mIdx === modIdx) {
                                                                            const newLessons = mod.lessons.map((les, lIdx) => {
                                                                                if (lIdx === lesIdx) {
                                                                                    return {
                                                                                        ...les,
                                                                                        liveClassLink: e.target.value
                                                                                    };
                                                                                }
                                                                                return les;
                                                                            });
                                                                            return { ...mod, lessons: newLessons };
                                                                        }
                                                                        return mod;
                                                                    });
                                                                    setForm({ ...form, syllabus: newSyllabus });
                                                                }}
                                                                placeholder="https://meet.google.com/xxx-xxxx-xxx or https://zoom.us/j/xxxxx"
                                                                className="input input-bordered input-sm w-full"
                                                            />
                                                            <input
                                                                type="datetime-local"
                                                                value={lesson?.liveClassDate ? new Date(lesson.liveClassDate).toISOString().slice(0, 16) : ""}
                                                                onChange={(e) => {
                                                                    const newSyllabus = form.syllabus.map((mod, mIdx) => {
                                                                        if (mIdx === modIdx) {
                                                                            const newLessons = mod.lessons.map((les, lIdx) => {
                                                                                if (lIdx === lesIdx) {
                                                                                    return {
                                                                                        ...les,
                                                                                        liveClassDate: e.target.value ? new Date(e.target.value).toISOString() : ""
                                                                                    };
                                                                                }
                                                                                return les;
                                                                            });
                                                                            return { ...mod, lessons: newLessons };
                                                                        }
                                                                        return mod;
                                                                    });
                                                                    setForm({ ...form, syllabus: newSyllabus });
                                                                }}
                                                                className="input input-bordered input-sm w-full"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Assignment Section */}
                                                <div className="form-control flex flex-col gap-2 w-full pt-1">
                                                    <div className="flex justify-between items-center">
                                                        <label className="label p-0 justify-start">
                                                            <span className="label-text font-semibold">Assignment</span>
                                                        </label>
                                                        {!lesson?.assignmentPrompt ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newSyllabus = form.syllabus.map((mod, mIdx) => {
                                                                        if (mIdx === modIdx) {
                                                                            const newLessons = mod.lessons.map((les, lIdx) => {
                                                                                if (lIdx === lesIdx) {
                                                                                    return {
                                                                                        ...les,
                                                                                        assignmentPrompt: ""
                                                                                    };
                                                                                }
                                                                                return les;
                                                                            });
                                                                            return { ...mod, lessons: newLessons };
                                                                        }
                                                                        return mod;
                                                                    });
                                                                    setForm({ ...form, syllabus: newSyllabus });
                                                                }}
                                                                className="btn btn-sm btn-outline btn-secondary"
                                                            >
                                                                + Add Assignment
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newSyllabus = form.syllabus.map((mod, mIdx) => {
                                                                        if (mIdx === modIdx) {
                                                                            const newLessons = mod.lessons.map((les, lIdx) => {
                                                                                if (lIdx === lesIdx) {
                                                                                    const { assignmentPrompt, ...rest } = les;
                                                                                    return rest;
                                                                                }
                                                                                return les;
                                                                            });
                                                                            return { ...mod, lessons: newLessons };
                                                                        }
                                                                        return mod;
                                                                    });
                                                                    setForm({ ...form, syllabus: newSyllabus });
                                                                }}
                                                                className="btn btn-sm btn-ghost btn-error"
                                                            >
                                                                Remove Assignment
                                                            </button>
                                                        )}
                                                    </div>
                                                    {lesson?.assignmentPrompt !== undefined && (
                                                        <textarea
                                                            value={lesson?.assignmentPrompt || ""}
                                                            onChange={(e) => {
                                                                const newSyllabus = form.syllabus.map((mod, mIdx) => {
                                                                    if (mIdx === modIdx) {
                                                                        const newLessons = mod.lessons.map((les, lIdx) => {
                                                                            if (lIdx === lesIdx) {
                                                                                return {
                                                                                    ...les,
                                                                                    assignmentPrompt: e.target.value
                                                                                };
                                                                            }
                                                                            return les;
                                                                        });
                                                                        return { ...mod, lessons: newLessons };
                                                                    }
                                                                    return mod;
                                                                });
                                                                setForm({ ...form, syllabus: newSyllabus });
                                                            }}
                                                            placeholder="Enter assignment instructions..."
                                                            className="textarea textarea-bordered textarea-sm w-full"
                                                            rows="3"
                                                        />
                                                    )}
                                                </div>

                                                {/* Quiz Section */}
                                                <div className="form-control flex flex-col gap-2 w-full pt-1">
                                                    <div className="flex justify-between items-center">
                                                        <label className="label p-0 justify-start">
                                                            <span className="label-text font-semibold">Quiz Questions (Optional)</span>
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newSyllabus = [...form.syllabus];
                                                                if (!newSyllabus[modIdx].lessons[lesIdx].quiz) {
                                                                    newSyllabus[modIdx].lessons[lesIdx].quiz = [];
                                                                }
                                                                newSyllabus[modIdx].lessons[lesIdx].quiz.push({
                                                                    question: "",
                                                                    options: ["", "", "", ""],
                                                                    correctIndex: 0,
                                                                });
                                                                setForm({ ...form, syllabus: newSyllabus });
                                                            }}
                                                            className="btn btn-xs btn-outline"
                                                        >
                                                            + Add Question
                                                        </button>
                                                    </div>

                                                    {lesson.quiz?.map((quizItem, qIdx) => (
                                                        <div key={qIdx} className="card bg-base-300/80 border border-base-content/10">
                                                            <div className="card-body p-3 space-y-2">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm font-semibold">Question {qIdx + 1}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newSyllabus = [...form.syllabus];
                                                                            newSyllabus[modIdx].lessons[lesIdx].quiz = newSyllabus[modIdx].lessons[lesIdx].quiz.filter((_, i) => i !== qIdx);
                                                                            setForm({ ...form, syllabus: newSyllabus });
                                                                        }}
                                                                        className="btn btn-xs btn-error"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>

                                                                <input
                                                                    type="text"
                                                                    value={quizItem.question}
                                                                    onChange={(e) => {
                                                                        const newSyllabus = [...form.syllabus];
                                                                        newSyllabus[modIdx].lessons[lesIdx].quiz[qIdx].question = e.target.value;
                                                                        setForm({ ...form, syllabus: newSyllabus });
                                                                    }}
                                                                    placeholder="Enter question"
                                                                    className="input input-bordered input-sm w-full"
                                                                />

                                                                <div className="space-y-1.5 pt-1">
                                                                    {quizItem.options.map((option, optIdx) => (
                                                                        <div key={optIdx} className="flex gap-2 items-center">
                                                                            <input
                                                                                type="radio"
                                                                                name={`quiz-${modIdx}-${lesIdx}-${qIdx}`}
                                                                                checked={quizItem.correctIndex === optIdx}
                                                                                onChange={() => {
                                                                                    const newSyllabus = [...form.syllabus];
                                                                                    newSyllabus[modIdx].lessons[lesIdx].quiz[qIdx].correctIndex = optIdx;
                                                                                    setForm({ ...form, syllabus: newSyllabus });
                                                                                }}
                                                                                className="radio radio-xs"
                                                                            />
                                                                            <input
                                                                                type="text"
                                                                                value={option}
                                                                                onChange={(e) => {
                                                                                    const newSyllabus = [...form.syllabus];
                                                                                    newSyllabus[modIdx].lessons[lesIdx].quiz[qIdx].options[optIdx] = e.target.value;
                                                                                    setForm({ ...form, syllabus: newSyllabus });
                                                                                }}
                                                                                placeholder={`Option ${optIdx + 1}`}
                                                                                className="input input-bordered input-sm flex-1 w-full"
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => {
                            setForm({
                                ...form,
                                syllabus: [...form.syllabus, { title: "", lessons: [] }],
                            });
                        }}
                        className="btn btn-outline btn-sm w-full"
                    >
                        + Add Module
                    </button>
                </div>

                {/* Batches Section */}
                <div className="divider my-6 sm:my-8 font-semibold text-base sm:text-lg">
                    Batches (Optional)
                </div>
                <div className="space-y-4">
                    {form.batches.map((batch, idx) => (
                        <div key={idx} className="card bg-base-100 border border-base-300 shadow-sm">
                            <div className="card-body p-4 sm:p-6 space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-base-200">
                                    <h4 className="font-semibold text-base">Batch {idx + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeBatch(idx)}
                                        className="btn btn-sm btn-error"
                                    >
                                        Remove Batch
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="form-control flex flex-col gap-1.5 w-full">
                                        <label className="label p-0 justify-start">
                                            <span className="label-text font-semibold">Batch Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={batch.name}
                                            onChange={(e) => updateBatch(idx, "name", e.target.value)}
                                            placeholder="e.g., Batch 1, Jan 2025"
                                            className="input input-bordered input-sm w-full"
                                        />
                                    </div>

                                    <div className="form-control flex flex-col gap-1.5 w-full">
                                        <label className="label p-0 justify-start">
                                            <span className="label-text font-semibold">Start Date</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={batch.startDate}
                                            onChange={(e) => updateBatch(idx, "startDate", e.target.value)}
                                            className="input input-bordered input-sm w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addBatch}
                        className="btn btn-outline btn-sm"
                    >
                        + Add Batch
                    </button>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-base-300">
                    <button
                        type="submit"
                        disabled={creating}
                        className="btn btn-primary w-full sm:flex-1"
                    >
                        {creating ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Creating...
                            </>
                        ) : (
                            "Create Course"
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/admin/courses")}
                        className="btn btn-outline w-full sm:w-auto px-6"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
