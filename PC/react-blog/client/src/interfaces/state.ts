import { State as UserState } from './user';
import { State as CommentState } from './comment';
import { State as ArticaleState } from './articale';

interface State {
    user: UserState;
    comment: CommentState;
    article: ArticaleState;
}

export type reduxState = State;