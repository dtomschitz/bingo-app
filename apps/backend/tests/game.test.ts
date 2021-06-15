import {
  afterAll,
  assert,
  assertEquals,
  assertExists,
  assertNotEquals,
  assertThrowsAsync,
  beforeAll,
  describe,
  GQLError,
  it,
  v4,
} from './test.deps.ts';
import {
  defaultInvalidRequestTest,
  defaultUser,
  generateBingoFields,
  getDatabase,
} from './common.ts';
import { GameService } from '../src/service/index.ts';
import { Database, GameDatabase } from '../src/database/index.ts';
import {
  CreateGame,
  ErrorType,
  FieldMutations,
  GamePhase,
  MutationType,
  UpdateGame,
} from '../src/models.ts';

describe('Game', () => {
  let database: Database;
  let games: GameDatabase;
  let service: GameService;

  const before = () =>
    beforeAll(async () => {
      database = await getDatabase();
      games = new GameDatabase(database);
      await games.clear();

      service = new GameService(games);
    });

  const after = () =>
    afterAll(() => {
      database.close();
    });

  const createDefaultGame = async (options?: {
    props?: CreateGame;
    length?: number;
  }) => {
    const defaultProps: CreateGame = {
      title: 'Test Spiel',
      fields: generateBingoFields(options?.length).map(field => field.text),
    };
    const result = await service.createGame(
      options?.props ?? defaultProps,
      defaultUser,
    );

    return { props: options?.props ?? defaultProps, result };
  };

  describe('createGame', () => {
    before();
    after();

    defaultInvalidRequestTest('should fail because request is incorrect', () =>
      service.createGame(
        {
          title: '',
          fields: [],
        },
        defaultUser,
      ),
    );

    it('should fail because there are to few fields in the request', async () => {
      const fields = generateBingoFields(20).map(field => field.text);

      await assertThrowsAsync(
        async () =>
          await service.createGame(
            {
              title: 'Test Spiel',
              fields,
            },
            defaultUser,
          ),
        GQLError,
        ErrorType.GAME_CONTAINS_TOO_FEW_FIELDS,
      );
    });

    it('should create a new game', async () => {
      const props: CreateGame = {
        title: 'Test Spiel',
        fields: generateBingoFields().map(field => field.text),
      };

      const game = await service.createGame(props, defaultUser);

      assertExists(game?._id);
      assertExists(game?.authorId);
      assertExists(game?.fields);

      assertEquals(game?.authorId, defaultUser._id);
      assertEquals(game?.title, props.title);
      assertEquals(game?.instances, {});
      assertEquals(game?.phase, GamePhase.EDITING);
    });
  });

  describe('createGameInstance', () => {
    before();
    after();

    defaultInvalidRequestTest('should fail because request is incorrect', () =>
      service.createGameInstance('', defaultUser),
    );

    it('should fail because there is no game stored with the given id', async () => {
      await assertThrowsAsync(
        async () =>
          await service.createGameInstance(
            '60c76e7f7060587fd786decf',
            defaultUser,
          ),
        GQLError,
        ErrorType.GAME_NOT_FOUND,
      );
    });

    it('should fail because there is already a instance stored for the user', async () => {
      const { result } = await createDefaultGame();
      if (!result) {
        return;
      }

      const id = result._id.toHexString();
      await games.createGameInstance(id, {
        userId: defaultUser._id,
        fields: Array.from({ length: 25 }).map((_, index) => `Test ${index}`),
      });

      await assertThrowsAsync(
        async () => await service.createGameInstance(id, defaultUser),
        GQLError,
        ErrorType.GAME_INSTANCE_ALREADY_CREATED,
      );
    });

    it('should create a new game instance for the user', async () => {
      const { result } = await createDefaultGame();
      if (!result) {
        return;
      }

      const id = result._id.toHexString();
      const game = await service.createGameInstance(id, defaultUser);

      assertExists(game?._id);
      assertExists(game?.authorId);
      assert(game?.hasInstance);
      assert(Array.isArray(game?.instanceFields));
      assertEquals(game?.instanceFields.length, 25);
      assertEquals(game?.fields.length, result.fields.length);

      const updateGame = await service.getGame(id);
      assert(defaultUser._id in updateGame.instances);

      const instance = updateGame.instances[defaultUser._id];
      assertEquals(instance.userId, defaultUser._id);
      assertEquals(instance.fields.length, 25);
    });
  });

  describe('updateGame', () => {
    before();
    after();

    defaultInvalidRequestTest('should fail because request is incorrect', () =>
      service.updateGame({ _id: '', changes: {} }),
    );

    it('should fail because there is no game stored with the given id', async () => {
      await assertThrowsAsync(
        async () =>
          await service.updateGame({
            _id: '60c76e7f7060587fd786decf',
            changes: {},
          }),
        GQLError,
        ErrorType.GAME_NOT_FOUND,
      );
    });

    it('should update the specific game', async () => {
      const { result } = await createDefaultGame();
      if (!result) {
        return;
      }

      const props: UpdateGame = {
        _id: result._id.toHexString(),
        changes: {
          title: 'Super tolles Spiel',
        },
      };

      const game = await service.updateGame(props);

      assertEquals(game?._id, result._id);
      assertEquals(game?.authorId, result.authorId);
      assertEquals(game?.title, props.changes.title);
      assertEquals(game?.instances, {});
      assertEquals(game?.phase, GamePhase.EDITING);
    });
  });

  describe('mutateGameFields', () => {
    before();
    after();

    defaultInvalidRequestTest('should fail because request is incorrect', () =>
      service.mutateGameField('', {
        type: MutationType.CREATE,
        _id: '',
        text: 'test',
      }),
    );

    it('should fail because there is no game stored with the given id', async () => {
      const mutation: FieldMutations = {
        type: MutationType.CREATE,
        _id: '',
        text: 'test',
      };

      await assertThrowsAsync(
        async () =>
          await service.mutateGameField('60c76e7a7060587fd786dece', mutation),
        GQLError,
        ErrorType.GAME_NOT_FOUND,
      );
    });

    it('it should add a new field to the specific game', async () => {
      const { result } = await createDefaultGame();
      if (!result) {
        return;
      }

      const gameId = result._id.toHexString();
      const mutation: FieldMutations = {
        type: MutationType.CREATE,
        _id: v4.generate(),
        text: 'Neues Feld',
      };

      let game = await games.getGame(gameId);
      assertEquals(game?._id, result._id);
      assertEquals(game?.authorId, result.authorId);
      assertEquals(game?.fields.length, result.fields.length);

      await service.mutateGameField(gameId, mutation);
      game = await games.getGame(gameId);
      const field = game?.fields[game.fields.length - 1];

      assertNotEquals(game?.fields.length, result.fields.length);
      assertExists(field?._id);
      assertEquals(field?.text, mutation.text);
      assertEquals(field?.checked, false);
    });

    it('it should update a specific field in the game', async () => {
      const { result } = await createDefaultGame();
      if (!result) {
        return;
      }

      const gameId = result._id.toHexString();
      const index = 15;

      const mutation: FieldMutations = {
        type: MutationType.UPDATE,
        _id: result.fields[index]._id,
        changes: {
          text: 'Update Field',
          checked: true,
        },
      };

      let game = await games.getGame(gameId);
      assertEquals(game?.fields[index]._id, mutation._id);
      assertEquals(game?.fields[index].text, 'Field 15');
      assertEquals(game?.fields[index].checked, false);
      assertEquals(game?.fields.length, result.fields.length);

      await service.mutateGameField(gameId, mutation);
      game = await games.getGame(gameId);

      const field = game?.fields[index];

      assertEquals(game?.fields.length, result.fields.length);
      assertExists(field?._id);
      assertEquals(field?.text, mutation.changes.text);
      assertEquals(field?.checked, mutation.changes.checked);
    });

    it('it should delete a specific field in the game', async () => {
      const { result } = await createDefaultGame();
      if (!result) {
        return;
      }

      const gameId = result._id.toHexString();
      const index = 15;

      const mutation: FieldMutations = {
        type: MutationType.DELETE,
        _id: result.fields[index]._id,
      };

      let game = await games.getGame(gameId);
      assertEquals(game?.fields[index]._id, mutation._id);
      assertEquals(game?.fields[index].text, 'Field 15');
      assertEquals(game?.fields[index].checked, false);
      assertEquals(game?.fields.length, result.fields.length);

      await service.mutateGameField(gameId, mutation);
      game = await games.getGame(gameId);

      const field = game?.fields[index];

      assertNotEquals(game?.fields.length, result.fields.length);
      assertExists(field?._id);
      assertNotEquals(field?.text, 'Field 15');
    });
  });

  describe('deleteGame', () => {
    before();
    after();

    defaultInvalidRequestTest('should fail because request is incorrect', () =>
      service.deleteGame(''),
    );

    it('should fail because there is no game stored with the given id', async () => {
      await assertThrowsAsync(
        async () => await service.deleteGame('60c76e7a7060587fd786dece'),
        GQLError,
        ErrorType.GAME_NOT_FOUND,
      );
    });

    it('it should delete the specific game', async () => {
      const { result } = await createDefaultGame();
      if (!result) {
        return;
      }

      const id = result._id.toHexString();
      await service.deleteGame(id);

      await assertThrowsAsync(
        async () => await service.getGame(id),
        GQLError,
        ErrorType.GAME_NOT_FOUND,
      );
    });
  });
});
