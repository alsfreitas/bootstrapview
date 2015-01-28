
function atualizaPagina(){
  jQuery.support.cors = true
  var canvas = $(".canvas")
  var dados = $(".dados")
  for(var i = 0; i < canvas.length; i++){
    (function(indice){
      $.ajax({
        cache: false,
        url: "http://jb-hml-mig:8080/ancineservicos/sanfom/itens/"+canvas[indice].getAttribute("data-item-id")+"/?custoProjeto="+custoProjeto+"&longa="+longa+"&custoItem="+canvas[indice].getAttribute("data-custo-item")+"&seriado="+seriado+"&tipologia="+tipologia,
        method: "GET",
        dataType: 'json',
        success: function(retorno){
          var pontos = $.extend(true, [], retorno.pontos)
          var pontosNaoNulos = []

          for(var j = 0; j < pontos.length; j++){
            if(pontos[j].valor != 0){
              pontosNaoNulos.push(pontos[j])
            }
          }

          pontos  = pontosNaoNulos
          pontos.sort(function(a,b){return a.valor - b.valor;})
          $("#"+dados[indice]['id']).find(".valor_minimo").append(formatador_numero(pontos[0].valor))
          $("#"+dados[indice]['id']).find(".valor_maximo").append(formatador_numero(pontos[pontos.length-1].valor))
          $("#"+dados[indice]['id']).find(".custos_positivos").append(pontos.length)
          pontos.push({'valor': canvas[indice].getAttribute("data-custo-item")})
          pontos.sort(function(a,b){return a.valor - b.valor;})
          retorno.pontos = pontos
          drawD3Document(retorno, canvas[indice]['id'], indice);

          if(retorno.limitesBootstrap[1] > retorno.limitesBootstrap[0]){
            $("#"+dados[indice]['id']).find(".bootstrap").append("["+formatador_numero(retorno.limitesBootstrap[0])+"-"+formatador_numero(retorno.limitesBootstrap[1])+"]")
          }else{
            $("#"+dados[indice]['id']).find(".bootstrap").append("Não aplicável")
          }
        }
      });
    })(i);
  }
}
