// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    // input - number for index
    // ouput - boolean
    hasRowConflictAt: function(rowIndex) {
      // get row
      let row = this.get(rowIndex);
      // create countPieces var
      let countPieces = 0;
      // iterate through the row
      for (var i = 0; i < row.length; i++) {
        // if current item is 1
        if (row[i] === 1) {
          // increment count pieces
          countPieces++;
        }
        // if countPieces is greater than 1 then return true;
        if (countPieces > 1) {
          return true;
        }
      }
      // lastly return false;
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var size = this.get('n');
      for (var i = 0; i < size; i++) {
        if (this.hasRowConflictAt(i) === true) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var rows = this.rows();
      var countPieces = 0;
      for (var i = 0; i < rows.length; i++) {
        if (rows[i][colIndex] === 1) {
          countPieces++;
        }
        if (countPieces > 1) {
          return true;
        }
      }
      return false;

    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var size = this.get('n');
      for (var i = 0; i < size; i++) {
        if (this.hasColConflictAt(i) === true) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    // inputs - rows / columns simply number
    // outputs - boolean
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow, row = 0) {
      // get rows
      var table = this.rows();
      var column = majorDiagonalColumnIndexAtFirstRow;
      // counting variable
      var diagonalOffset = this._getFirstRowColumnIndexForMajorDiagonalOn(row, column);
      var counter = 0;
      for (var i = 0; i < table.length; i++) {
        for (var j = diagonalOffset; j < table.length; j++) {
          // check if there is a conflict
          if (table[i][j] === 1 && this._getFirstRowColumnIndexForMajorDiagonalOn(i, j) === diagonalOffset) {
            // increment count
            counter++;
            // return true if count is greater than 1
            if (counter > 1) {
              // else false
              return true;
            }
          }
        }
      }
      return false;
    },
    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var table = this.rows();
      var column = this.get('n');
      for (var i = 0 - (column - 2); i < column; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict

    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow, row = 0) {
      // make var for n given
      var table = this.rows();
      var diagonalOffset = this._getFirstRowColumnIndexForMinorDiagonalOn(row, minorDiagonalColumnIndexAtFirstRow);
      // create counter var
      var counter = 0;
      // loop through diagonal and seek queens that are in play
      for (var i = 0; i < table.length; i++) {
        for (var j = diagonalOffset; j >= 0; j--) {
          // check if there is a conflict
          if (table[i][j] === 1 && this._getFirstRowColumnIndexForMinorDiagonalOn(i, j) === diagonalOffset) {
            // increment count
            counter++;
            // return true if count is greater than 1
            if (counter > 1) {
              // else false
              return true;
            }
          }
        }
      }
      // return true if conflict
      // else false
      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    // hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow, row = 0)
    hasAnyMinorDiagonalConflicts: function() {
      // create var for rows
      var table = this.rows();
      // create var for columns
      var columns = this.get('n');
      // loop over columns
      for (var i = 0; i < columns; i++) {
        // checking for minor conflicts at i
        if (this.hasMinorDiagonalConflictAt(i) === true) {
          return true;
        }
      }
      // separate loop to check rows.length
      for (var j = 0; j < table.length; j++) {
        if (this.hasMinorDiagonalConflictAt(columns, j)) {
          return true;
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
