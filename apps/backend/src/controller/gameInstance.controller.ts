import { GQLError, v4, Bson, Context } from "../deps.ts";
import { database } from "../db/database.ts";
import { GameSchema, CreateGame } from "../schema/index.ts";
import { validateAuthentication } from "./auth.controller.ts";
import { UserSchema } from './../schema/mongo/user.schema.ts';
import { GameInstance, Field } from "../schema/mongo/game.schema.ts";

const gameCollection = database.getDatabase().collection<GameSchema>("game");

export const getInstance = async (
    parent: any,
    { _id }: { _id: any },
    context: Context,
    info: any
) => {
    const user: UserSchema | undefined = await validateAuthentication(context);

    if (!user) {
        throw new GQLError({
            message: "User not found"
        })
    }

    const game = await gameCollection.findOne({ _id: new Bson.ObjectId(_id) });
    if (!game) {
        throw new GQLError({
            message: "There is no game with the specified id",
        });
    }

    if (!game.gameInstances) {
        throw new GQLError({
            message: "This game doesn't have any instances",
        });
    }

    const gameInstance: GameInstance[] = game.gameInstances.filter(instance => new Bson.ObjectId(instance.userId).toString() === new Bson.ObjectId(user._id).toString());

    if (!gameInstance[0]) {
        throw new GQLError({
            message: "There is no Instance with the specified id for this user",
        });
    }

    return gameInstance[0].fields.map((fieldId: string) => {
        return game.fields.find((fieldEntry: Field) =>
            fieldEntry._id === fieldId
        );
    })
}


export const createInstance = async (
    parent: any,
    { _id }: { _id: any },
    context: Context,
    info: any
) => {
    const user: UserSchema | undefined = await validateAuthentication(context);

    if (!user) {
        throw new GQLError({
            message: "User not found"
        })
    }

    const game = await gameCollection.findOne({ _id: new Bson.ObjectId(_id) });
    if (!game) {
        throw new GQLError({
            message: "There is no game with the specified id",
        });
    }

    const fields = game.fields;

    if (game.gameInstances?.some(instance => new Bson.ObjectId(instance.userId).toString() === new Bson.ObjectId(user._id).toString())) {
        throw new GQLError({
            message: "Only one instance allowed per user",
        });
    }

    let randomNumber = function (min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    const randomFields: number[] = [];

    while (randomFields.length < 25) {
        const index = randomNumber(0, (fields.length - 1))

        if (!randomFields.includes(index)) {
            randomFields.push(index)
        }
    }

    const fieldMap = randomFields.map((fieldIndex) => {
        return fields[fieldIndex]._id
    })

    const gameId = await gameCollection.updateOne(
        { _id: new Bson.ObjectId(_id) },
        {
            $push: {
                gameInstances:
                {
                    userId: new Bson.ObjectId(user._id),
                    fields: fieldMap
                }
            }
        }
    )

    return randomFields.map((fieldIndex) => {
        return fields[fieldIndex].name
    })
}
