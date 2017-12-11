'use strict';

exports.list = (req, res) => {
    res.json({ message: 'list' })
}

exports.create = (req, res) => {
     res.json({ message: 'Create' })
}

exports.read = (req, res) => {
     res.json({ message: 'Read' })
}

exports.update = (req, res) => {
     res.json({ message: 'Update' })
}

exports.delete = (req, res) => {
    res.json({ message: 'Deleted' })
}
