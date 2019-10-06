"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AggregateRoot_1 = require("../../../shared/domain/AggregateRoot");
const Result_1 = require("../../../shared/core/Result");
const postId_1 = require("./postId");
const Guard_1 = require("../../../shared/core/Guard");
const lodash_1 = require("lodash");
const postCreated_1 = require("./events/postCreated");
class Post extends AggregateRoot_1.AggregateRoot {
    get postId() {
        return postId_1.PostId.create(this._id)
            .getValue();
    }
    get memberId() {
        return this.props.memberId;
    }
    get title() {
        return this.props.title;
    }
    get slug() {
        return this.props.slug;
    }
    get dateTimePosted() {
        return this.props.dateTimePosted;
    }
    get comments() {
        return this.props.comments;
    }
    get points() {
        return this.props.points;
    }
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const guardResult = Guard_1.Guard.againstNullOrUndefinedBulk([
            { argument: props.memberId, argumentName: 'memberId' },
            { argument: props.slug, argumentName: 'slug' },
            { argument: props.title, argumentName: 'title' },
            { argument: props.text, argumentName: 'text' },
        ]);
        if (!guardResult.succeeded) {
            return Result_1.Result.fail(guardResult.message);
        }
        const defaultValues = Object.assign(Object.assign({}, props), { comments: props.comments ? props.comments : [], points: lodash_1.has(props, 'points') ? props.points : 1, dateTimePosted: props.dateTimePosted ? props.dateTimePosted : new Date() });
        const isNewPost = !!id === false;
        const post = new Post(defaultValues, id);
        if (isNewPost) {
            post.addDomainEvent(new postCreated_1.PostCreated(post));
        }
        return Result_1.Result.ok(post);
    }
}
exports.Post = Post;
//# sourceMappingURL=post.js.map