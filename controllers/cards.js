const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ error: err.message }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => new Error(`Карточка с _id ${req.params.cardId} не найдена`))
    .then((card) => {
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        return res.status(401).send({ message: 'Невозможно удалить чужую карточку' });
      }
      res.send({ data: card, message: 'Карточка удалена' });
      return card.remove();
    })
    .catch((err) => res.status(404).send({ error: err.message }));
};
